@echo off
set PATH=%~dp0..\.tools\node-v20.20.2-win-x64;%PATH%
cd /d %~dp0
npm run dev
