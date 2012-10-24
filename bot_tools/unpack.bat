:: Unpacks archives into the current directory if they aren't already unpacked.
@echo off

set ERRORLEVEL=0

:: The best way to get an unattended local install of 7-zip is to unpack the
:: msi.
if exist "%CD%\7zip" goto :CMAKE_CHECK
echo Unpacking 7zip msi...
call msiexec /a "%~dp0\7zip.msi" /passive TARGETDIR="%CD%\7zip"
if errorlevel 1 goto :ZIP_FAIL
goto :CMAKE_CHECK

:ZIP_FAIL
echo ... failed to unpack 7-zip
set ERRORLEVEL=1
goto :END

:: Unpack cmake.zip with the 7z.exe we just unpacked.  If we cut our 7-zip
:: dependence, we can use unzip.js from the bootstrap code in depot_tools.
:CMAKE_CHECK
if exist "%CD%\cmake\bin\cmake.exe" goto :END
echo Unpacking cmake ...
if exist cmake_unpacked rd /q /s cmake_unpacked
if exist cmake rd /q /s cmake
call 7zip\Files\7-zip\7z.exe x "%~dp0\cmake.zip" -ocmake_unpacked 2>nul 1>nul 
if errorlevel 1 goto :CMAKE_FAIL
:: Rename the top level directory from cmake-2.8.9.NNNN to just cmake.
move cmake_unpacked\cmake-* cmake 2>nul 1>nul
rd /q /s cmake_unpacked
set ERRORLEVEL=0
call cmake\bin\cmake.exe --version
if errorlevel 1 goto :CMAKE_FAIL

echo Unpacked all tools successfully
goto :END

:CMAKE_FAIL
echo ... failed to unpack CMake
set ERRORLEVEL=1
goto :END

:END
exit /b %ERRORLEVEL%
