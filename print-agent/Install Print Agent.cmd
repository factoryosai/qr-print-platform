@echo off
setlocal

:: Get current directory
set "DIR=%~dp0"
set "CONFIG_FILE=%DIR%agent-config.json"

:: Read shop ID from config to determine install path
for /f "tokens=4 delims=:," %%a in ('findstr /i "shop_id" "%CONFIG_FILE%"') do (
    set "SHOP_ID=%%~a"
)
:: Remove quotes and spaces
set "SHOP_ID=%SHOP_ID:"=%"
set "SHOP_ID=%SHOP_ID: =%"

if "%SHOP_ID%"=="" (
    echo Error: Could not read shop_id from agent-config.json
    pause
    exit /b 1
)

set "TARGET_DIR=%LocalAppData%\QRPrintAgent\%SHOP_ID%"
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

echo Installing QR Print Agent for Shop: %SHOP_ID%
echo.

:: Create target directory
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

:: Copy files
echo Copying files to %TARGET_DIR%...
copy /Y "%DIR%agent-config.json" "%TARGET_DIR%\"
copy /Y "%DIR%manage.ps1" "%TARGET_DIR%\"
copy /Y "%DIR%heartbeat.ps1" "%TARGET_DIR%\"

:: Check for SumatraPDF
echo Checking for SumatraPDF...
set "SUMATRA_PATH=%LocalAppData%\SumatraPDF\SumatraPDF.exe"
if exist "%SUMATRA_PATH%" (
    echo SumatraPDF found at %SUMATRA_PATH%
) else (
    echo SumatraPDF not found locally. It must be installed or placed in the expected path.
    :: In a full implementation, we'd download the portable zip and extract it.
    echo Please install SumatraPDF.
)

:: Create VBS launcher
set "VBS_FILE=%TARGET_DIR%\launcher.vbs"
echo Set WshShell = CreateObject("WScript.Shell") > "%VBS_FILE%"
echo WshShell.Run "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File ""%TARGET_DIR%\manage.ps1""", 0, False >> "%VBS_FILE%"

:: Create shortcut in Startup
set "SHORTCUT=%STARTUP_FOLDER%\QRPrintAgent_%SHOP_ID%.lnk"
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateShortcut.vbs"
echo sLinkFile = "%SHORTCUT%" >> "%TEMP%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateShortcut.vbs"
echo oLink.TargetPath = "wscript.exe" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Arguments = """%VBS_FILE%""" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%TARGET_DIR%" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\CreateShortcut.vbs"
cscript //nologo "%TEMP%\CreateShortcut.vbs"
del "%TEMP%\CreateShortcut.vbs"

echo.
echo Installation complete! The Print Agent will start automatically on login.
echo Starting it now...
wscript.exe "%VBS_FILE%"

echo.
pause
