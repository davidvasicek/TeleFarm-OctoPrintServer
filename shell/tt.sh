#!/bin/bash

# Globální proměnné
USER=$SUDO_USER
API_KEY=
api_key1=

path_currentDirectory= # cesta k adresáři, ze kterého byl skript spuštěn
path_octoprintConfig= # cesta k adresáři, ve kterém je config od octoprintu
path_envFile=../.env # cesta k adresáři, ve kterém je .env soubor
path_pip=/home/$USER/oprint/bin/pip # cesta k adresáři, ve kterém je pip


# Zkontrolovat, zda existuje soubor config.yaml
path_octoprintConfig="/home/$USER/.octoprint/config.yaml"
if [ ! -f "$path_octoprintConfig" ]; then
    echo "Chyba: Soubor $path_octoprintConfig neexistuje."
    exit 1
fi

# -------------------------------------------------------------------------------------------------------
# Záloha potřebných souborů
# -------------------------------------------------------------------------------------------------------

    # Záloha config.yaml
    cp "$path_octoprintConfig" "$path_octoprintConfig"_backup

# -------------------------------------------------------------------------------------------------------
# Získání potřebných dat
# -------------------------------------------------------------------------------------------------------

    # Získat aktuální adresář
    path_currentDirectory="$PWD"

    # Získat hlavní API klíč z config.yaml (pro prvotní volání API)
    API_KEY=$(grep -oP 'key: \K[A-F0-9]{32}' "$path_octoprintConfig")



# -------------------------------------------------------------------------------------------------------
# Instalace doplňků
# -------------------------------------------------------------------------------------------------------

    $path_pip install "https://github.com/thomst08/OctoLight/archive/master.zip"
    $path_pip install "https://github.com/kantlivelong/OctoPrint-PSUControl/archive/master.zip"
    $path_pip install "https://github.com/LazeMSS/OctoPrint-UICustomizer/archive/main.zip"
    $path_pip install "https://github.com/j7126/OctoPrint-Dashboard/archive/master.zip"
    $path_pip install "https://github.com/jneilliii/OctoPrint-PrusaSlicerThumbnails/archive/master.zip"

# -------------------------------------------------------------------------------------------------------
# ........
# -------------------------------------------------------------------------------------------------------



# -------------------------------------------------------------------------------------------------------
# ........
# -------------------------------------------------------------------------------------------------------



# -------------------------------------------------------------------------------------------------------
# ........
# -------------------------------------------------------------------------------------------------------





# Zavolat API pro generování aplikačního klíče
response=$(curl -s -H "Content-Type: application/json" -H "X-Api-Key: $API_KEY" -X POST -d '{"command": "generate","app": "eeedde"}' localhost/api/plugin/appkeys)

# Zpracování chyby při volání API
if [ $? -ne 0 ]; then
    echo "Chyba: Nastala chyba při volání API."
    exit 1
fi

if [ $? -ne 0 ]; then
    echo "Chyba: Nastala chyba při volání API."
    exit 1
else
    # Získat aplikační klíč z odpovědi
    api_key1=$(echo "$response" | grep -oP '"api_key": "\K[A-F0-9]{32}')
    # Uložit aplikační klíč do .env souboru
    sed -i 's/^OCTOPRINT_API_KEY=.*/OCTOPRINT_API_KEY='"$api_key1"'/' $path_envFile
fi


//cp "$path_currentDirectory/config/octoprint_config.yaml" "$path_octoprintConfig"

