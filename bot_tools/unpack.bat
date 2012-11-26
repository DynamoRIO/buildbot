:: Copyright (c) 2012 Google, Inc
::
:: Unpacks archives into the current directory if they aren't already unpacked.
@echo off

set ERRORLEVEL=0

cscript //nologo //e:jscript "%~dp0unpack.js"

exit /b %ERRORLEVEL%
