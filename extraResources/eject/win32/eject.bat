chcp 65001

set DRIVE=%~1
set BAT_PATH=%~dp0

powershell -Command "(New-Object -comObject Shell.Application).Namespace(17).ParseName('%DRIVE%').InvokeVerb('Eject'); Start-Sleep -Milliseconds 1500"

exit /b 0