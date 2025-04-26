# helper script to quickly stop and start the installed elecord-rpc windows service
# prevents port conflicts during debugging

Write-Host "elecord-rpc service helper"

if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Must be run as Administrator. Exiting."
    exit
}

Write-Host "🛑 Stopping elecord-rpc service..."
.\node_modules\nssm-bin\nssm.exe stop elecord-rpc

Write-Host "> Press any key to restart the service..."
$null = $host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')

Write-Host "🟢 Starting elecord-rpc service..."
.\node_modules\nssm-bin\nssm.exe start elecord-rpc
