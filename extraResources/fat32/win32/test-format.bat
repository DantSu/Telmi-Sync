@echo off

if "%~1"=="" (
  echo wrong-parameters 1>&2
  exit /b 1
)

set DRIVE_LETTER=%~1
set VOLUME_NUMBER=

for /f "tokens=2,3" %%a in ('powershell -Command "\"LIST VOLUME\" | diskpart"') do (
  if %%b==%DRIVE_LETTER% (
    set VOLUME_NUMBER=%%a
  )
)

if "%VOLUME_NUMBER%"=="" (
  echo volume-not-found 1>&2
  exit /b 1
)

reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoDriveTypeAutoRun /t REG_DWORD /d 255 /f >nul 2>&1
powershell -command "Add-MpPreference -ExclusionPath \"%DRIVE_LETTER%:\\\"" >nul 2>&1

powershell -Command "\"SELECT VOLUME %VOLUME_NUMBER%`r`nREMOVE`r`nexit\" | diskpart" >nul 2>&1
powershell -command "Start-Sleep -Milliseconds 250" >nul 2>&1
powershell -Command "\"SELECT VOLUME %VOLUME_NUMBER%`r`nASSIGN LETTER=%DRIVE_LETTER%`r`nSELECT VOLUME 0`r`nRESCAN`r`nLIST VOLUME`r`nexit\" | diskpart"

echo y | .\format.exe %DRIVE_LETTER%: >nul 2>&1
set EXIT_CODE=%ERRORLEVEL%

powershell -command "Remove-MpPreference -ExclusionPath \"%DRIVE_LETTER%:\\\"" >nul 2>&1
reg delete "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoDriveTypeAutoRun /f >nul 2>&1

if %EXIT_CODE% equ 0 (
    echo success
) else (
    echo format-failed 1>&2
)

exit /b %EXIT_CODE%