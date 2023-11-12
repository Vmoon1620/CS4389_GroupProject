@echo off

@Rem Set this variable to name your local python environment for the project
Set "VIRTUAL_ENV=.project_env"

echo [*] Setting up Server project.
cd Server
echo [*] Checking for Virtual Environment. & echo:

@Rem Checks for an existing virtual environment, skip this part if found
If Not Exist "%VIRTUAL_ENV%\Scripts\activate.bat" (
    echo [*] Virtual Environment not found, setting up project environment.
    python -m venv %VIRTUAL_ENV%

    If Not Exist "%VIRTUAL_ENV%\Scripts\activate.bat" (
        echo [-] An issue with environment setup occurred.
        echo [-] Unable to setup Virtual Environment.
        Exit /B 1
    )

    echo [+] Virtual Environment: "%VIRTUAL_ENV%" setup complete.
) else (
    echo [+] Virtual Environment: "%VIRTUAL_ENV%" found. & echo:
)

@Rem Once a virtual environment is set up, it must be 
@Rem activated to make changes there instead of globally
echo [*] Setting "%VIRTUAL_ENV%" as active environment.
Call "%VIRTUAL_ENV%\Scripts\activate.bat"

if %ERRORLEVEL% NEQ 0 (
    echo [-] An issue activating environment has occurred.
    echo [-] Unable to finish setup.
    Exit /B 1
)

echo [*] Installing packages...

Call pip install -r requirements.txt

if %ERRORLEVEL% NEQ 0 (
    echo [-] An issue installing server packages has occurred.
    echo [-] Unable to finish setup.
    Exit /B 1
)

echo [+] Packages Installed successfully.
echo [+] Server files installed. & echo:

Call deactivate

cd ../Client

echo [*] Setting up client app...
Call npm install --force

if %ERRORLEVEL% NEQ 0 (
    echo [-] An issue installing client packages has occurred.
    echo [-] Unable to finish setup.
    Exit /B 1
)

echo [+] Packages Installed successfully.
echo [+] Client files installed.