#! /bin/bash

VIRTUAL_ENV=".project_env"

echo [*] Setting up Server project.
cd server
echo -e "[*] Checking for Virtual Environment.\n"

if [ ! -f "${VIRTUAL_ENV}/bin/activate" ]; then
    echo "[*] Virtual Environment not found, setting up project environment."
    python3 -m venv ${VIRTUAL_ENV}

    if [ ! -f "${VIRTUAL_ENV}/bin/activate" ]; then
        echo [-] An issue with environment setup occurred.
        echo [-] Unable to setup Virtual Environment.
        exit 1
    fi

    echo [+] Virtual Environment: ${VIRTUAL_ENV} setup complete.
else
    echo -e "[+] Virtual Environment: ${VIRTUAL_ENV} found.\n"
fi

echo [*] Setting ${VIRTUAL_ENV} as active environment.
source ${VIRTUAL_ENV}/bin/activate

if [ $? -ne 0 ]; then
    echo [-] An issue activating environment has occurred.
    echo [-] Unable to finish setup.
    exit 1
fi

echo [*] Installing packages...

pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo [-] An issue installing server packages has occurred.
    echo [-] Unable to finish setup.
    exit 1
fi

echo [+] Packages Installed successfully.
echo -e "[+] Server files installed.\n"

cd ../client

echo [*] Setting up client app...
npm install --force

if [ $? -ne 0 ]; then
    echo [-] An issue installing client packages has occurred.
    echo [-] Unable to finish setup.
    exit 1
fi

echo [+] Packages Installed successfully.
echo [+] Client files installed.