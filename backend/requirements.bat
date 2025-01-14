@echo off
pip install -r requirements.txt
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%
python -m spacy download en_core_web_sm
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%
echo Requirements installed successfully.
pause
