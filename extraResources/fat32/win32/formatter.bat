@echo off
setlocal EnableDelayedExpansion

if "%~1"=="" (
  echo wrong-parameters 1>&2
  exit /b 1
)

set DRIVE_LETTER=%~1
set BAT_PATH=%~dp0

for /f %%i in ('powershell -NoProfile -Command "[math]::Ceiling((Get-Volume -DriveLetter %DRIVE_LETTER%).Size / 1GB)"') do set SIZE_GB=%%i

reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoDriveTypeAutoRun /t REG_DWORD /d 255 /f >nul 2>&1
powershell -command "Add-MpPreference -ExclusionPath \"%DRIVE_LETTER%:\\\"" >nul 2>&1

%BAT_PATH%LockHunter.exe /unlock %DRIVE_LETTER%: /kill /silent >nul 2>&1

if %SIZE_GB% LEQ 32 (
  format %DRIVE_LETTER%: /FS:FAT32 /Q /V:TELMIOS /X /Y >nul 2>&1
) else (
  set DRIVE_NUMBER=
  for /f "tokens=2" %%a in ('%BAT_PATH%RMPARTUSB2.exe LIST ALLDRIVES ^| findstr /I " %DRIVE_LETTER%:"') do (
    set DRIVE_NUMBER=%%a
  )
  if "!DRIVE_NUMBER!" NEQ "" (
    %BAT_PATH%RMPARTUSB.exe drive=!DRIVE_NUMBER! SURE WINPE FAT32 NOACT VOLUME=TELMIOS >nul 2>&1
  )
)

set EXIT_CODE=%ERRORLEVEL%

powershell -command "Remove-MpPreference -ExclusionPath \"%DRIVE_LETTER%:\\\"" >nul 2>&1
reg delete "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoDriveTypeAutoRun /f >nul 2>&1

if %EXIT_CODE% NEQ 0 (
    echo formatting-failed-%EXIT_CODE% 1>&2
)

exit /b %EXIT_CODE%