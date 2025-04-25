; Inno Setup - Installer for Windows programs

#define MyAppName "elecord-rpc"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "elecord"
#define MyAppURL "https://elecord.app/"
#define MyAppExeName "erpc.exe"
#define MyAppDescription "Rich Presence (RPC) server for elecord"
#define LicenseLocation ".\LICENSE-AGPL-3.0"
#define IconLocation ".\media\app.ico"
#define NSSMLocation ".\node_modules\nssm-bin\nssm.exe"
#define OutputLocation ".\dist"

[Setup]
AppId={{EC7980B2-20B5-4FEA-BB4F-51C05DA8797B}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
UninstallDisplayIcon={app}\app.ico
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
LicenseFile={#LicenseLocation}
SetupIconFile={#IconLocation}
Compression=lzma
SolidCompression=yes
WizardStyle=modern
OutputBaseFilename=elecord-rpc-win
OutputDir={#OutputLocation}

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Files]
Source: "{#OutputLocation}\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#NSSMLocation}"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#IconLocation}"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"

[Run]
; post-install, setup windows erpc service
Filename: "{app}\nssm.exe"; Parameters: "install {#MyAppName} ""{app}\{#MyAppExeName}"""; Flags: runhidden;
Filename: "{app}\nssm.exe"; Parameters: "set {#MyAppName} AppDirectory ""{app}"""; Flags: runhidden;
Filename: "{app}\nssm.exe"; Parameters: "set {#MyAppName} Description ""{#MyAppDescription}"""; Flags: runhidden;
Filename: "{app}\nssm.exe"; Parameters: "start {#MyAppName}"; Flags: runhidden;

[UninstallRun]
; pre-uninstall, remove windows erpc service
Filename: "{app}\nssm.exe"; Parameters: "stop {#MyAppName}"; Flags: runhidden; RunOnceId: "StopService";
Filename: "{app}\nssm.exe"; Parameters: "remove {#MyAppName} confirm"; Flags: runhidden; RunOnceId: "RemoveService";
