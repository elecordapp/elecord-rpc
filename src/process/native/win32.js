import koffi from 'koffi';

// Load Windows API
const psapi = koffi.load('psapi.dll');
const kernel32 = koffi.load('kernel32.dll');
const ntdll = koffi.load('ntdll.dll');

// Define aliases for native data types
const DWORD = koffi.alias('DWORD', 'uint32_t');
const BOOL = koffi.alias('BOOL', 'int32_t');
const HANDLE = koffi.pointer('HANDLE', koffi.opaque());

const UNICODE_STRING = koffi.struct('UNICODE_STRING', {
  Length: 'uint16',
  MaximumLength: 'uint16',
  Buffer: HANDLE
});

// The SYSTEM_PROCESS_ID_INFORMATION structure is not officially documented
// https://www.geoffchappell.com/studies/windows/km/ntoskrnl/api/ex/sysinfo/process_id.htm
const SYSTEM_PROCESS_ID_INFORMATION = koffi.struct('SYSTEM_PROCESS_ID_INFORMATION', {
  ProcessId: HANDLE,
  ImageName: UNICODE_STRING
});

// Define native functions
const EnumProcesses = psapi.func('BOOL __stdcall EnumProcesses(_Out_ DWORD *lpidProcess, DWORD cb, _Out_ DWORD *lpcbNeeded)');
const GetLastError = kernel32.func('DWORD GetLastError()');
const NtQuerySystemInformation = ntdll.func('NtQuerySystemInformation', 'int32', ['int32', 'SYSTEM_PROCESS_ID_INFORMATION*', 'uint32', HANDLE]);

// Define constants and helper functions
const SystemProcessIdInformation = 88; // SYSTEM_INFORMATION_CLASS enum value for SystemProcessIdInformation

const STATUS_INFO_LENGTH_MISMATCH = 0xC0000004;
const NT_SUCCESS = (status) => status >= 0;
const NT_ERROR = (status) => status < 0;

// Using undocumented function NtQuerySystemInformation()
// to circumvent limited privilege of wmic or gwmi
// when querying executable path of a process
const getProcessImageName = (pid) => {
  let bufferSize = 1024;
  let buffer = Buffer.alloc(bufferSize);

  while (true) {
    const info = {
      ProcessId: pid,
      ImageName: {
        Length: 0,
        MaximumLength: buffer.length,
        Buffer: buffer
      }
    };

    const result = NtQuerySystemInformation(SystemProcessIdInformation, info, 24, null);

    if (NT_ERROR(result) && result !== STATUS_INFO_LENGTH_MISMATCH) {
      console.error(`NtQuerySystemInformation() failed with pid = ${pid}, error = ${result}`);
      return null;
    }

    if (NT_SUCCESS(result)) {
      return buffer.subarray(0, buffer.length).toString('utf16le');
    }

    // Prevent infinite loops
    if (bufferSize >= 0xffff) {
      console.error(`NtQuerySystemInformation() failed with pid = ${pid}, result could not fit in buffer of size 0xffff`)
      return null;
    }

    bufferSize *= 2;
    if (bufferSize > 0xffff) bufferSize = 0xffff;
    buffer = Buffer.alloc(bufferSize);
  }
};

// lists all running processes and retrieves their executable image names
// (filename of an executable binary, e.g. "notepad.exe")
export const getProcesses = () => new Promise((resolve) => {
  const processIds = new Uint32Array(1024);
  const bytesNeeded = new Uint32Array(1);
  let processes = [];

  const success = EnumProcesses(processIds, processIds.byteLength, bytesNeeded);
  if (!success) {
    console.error(`EnumProcesses failed with error: ${GetLastError()}`);
  } else {
    const numProcesses = bytesNeeded[0] / 4; // Divide by 4 because DWORD is 4 bytes
    for (let i = 0; i < numProcesses; ++i) {
      if (processIds[i]) {
        const imageName = getProcessImageName(processIds[i]);
        if (imageName != null) {
          processes.push([processIds, imageName]);
        }
      }
    }
  }
  resolve(processes)
});
