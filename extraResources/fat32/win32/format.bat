@echo off

if "%~1"=="" (
  echo wrong-parameters 1>&2
  exit /b 1
)

set DRIVE_LETTER=%~1
set BAT_PATH=%~dp0

reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoDriveTypeAutoRun /t REG_DWORD /d 255 /f >nul 2>&1
powershell -command "Add-MpPreference -ExclusionPath \"%DRIVE_LETTER%:\\\"" >nul 2>&1

powershell -command "Get-Process | Where-Object { $_.MainWindowTitle -match '^%DRIVE_LETTER%:' } | ForEach-Object { $_.CloseMainWindow() }" >nul 2>&1
powershell -command "(New-Object -ComObject 'Shell.Application').Windows() | Where-Object { $_.Document.Folder.Self.Path -match '^%DRIVE_LETTER%:' } | ForEach-Object { $_.Quit() }" >nul 2>&1

(echo y) | %BAT_PATH%format.exe %DRIVE_LETTER%: >nul 2>&1
set EXIT_CODE=%ERRORLEVEL%

powershell -command "Remove-MpPreference -ExclusionPath \"%DRIVE_LETTER%:\\\"" >nul 2>&1
reg delete "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoDriveTypeAutoRun /f >nul 2>&1

if %EXIT_CODE% NEQ 0 (
    echo formatting-failed 1>&2
)

exit /b %EXIT_CODE%