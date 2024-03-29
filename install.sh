#!/bin/bash

# Funkce pro logování zpráv
log() {
    local log_type=$1
    local message=$2
    local color

    case $log_type in
        "ERR") color="\e[31m" ;;  # Červená barva pro ERR
        "INFO") color="\e[36m" ;; # Azurová barva pro INFO
        "WARN") color="\e[33m" ;; # Žlutá barva pro WARN
        *) color="" ;;
    esac

    echo -e "${color}[${log_type}] ${message}\e[0m"
}

# Kontrola připojení k internetu
if ! ping -c 1 -W 2 "8.8.8.8" &> /dev/null; then
    log "ERR" "Není přístup k internetu. Zkontrolujte připojení a spusťte skript znovu"
    exit 1
fi

# Kontrola, zda je uživatel přihlášen jako root
if [ "$(id -u)" != "0" ]; then
    log "ERR" "Tento skript vyžaduje práva superuživatele (root)."
    exit 1
fi

# Záloha souborů config.yaml a haproxy.cfg
backup_file() {
    local source=$1
    local backup="$source"_backup

    if [ ! -f "$source" ]; then
        log "ERR" "Soubor $source neexistuje. Zkontrolujte soubor a opakujte akci"
        exit 1
    fi

    if [ ! -f "$backup" ]; then
        log "INFO" "Vytvářím zálohu $source."
        cp "$source" "$backup"
    else
        log "WARN" "Záloha $source již existuje"
    fi
}

backup_file "/home/$SUDO_USER/.octoprint/config.yaml"
backup_file "/etc/haproxy/haproxy.cfg"

service_directory="$(dirname "$service_path")"

# Kontrola souboru .env
env_file="$service_directory/env"
if [ ! -f "$env_file" ]; then
    log "ERR" "Soubor $env_file neexistuje. Zkontrolujte soubor a opakujte akci"
    exit 1
fi

# Kontrola prázdných/nezadefinovaných hodnot v .env
invalid_lines=0
while IFS= read -r line; do
    if [[ ! "$line" =~ ^\s*# && "$line" =~ .*=.* ]]; then
        line="${line#"${line%%[![:space:]]*}"}"
        line="${line%"${line##*[![:space:]]}"}"
        key="${line%%=*}"
        value="${line#*=}"
        
        if [[ -z "$value" ]]; then
            log "ERR" "V souboru .env chybí hodnota pro klíč '$key'."
            invalid_lines=$((invalid_lines+1))
        fi
    fi
done < "$env_file"

if [ "$invalid_lines" -gt 0 ]; then
    log "ERR" "Některé hodnoty v souboru .env nejsou správně nastaveny. Doplněte chybějící hodnoty."
    exit 1
else
    mv "$service_directory/env" "$service_directory/.env"
    log "INFO" "Soubor env byl přepsán na .env. Nyní upravujte tento soubor pomocí nano .env"
fi

# Zjištění verze Node.js, pokud existuje
if command -v node &> /dev/null; then
    node_version=$(node -v)
    log "INFO" "Node.js je již nainstalovaná. Verze: $node_version"
else
    # Instalace Node.js, pokud neexistuje
    log "INFO" "Instalace Node.js..."
    if ! curl -fsSL https://deb.nodesource.com/setup_current.x | bash - &> /dev/null; then
        log "ERR" "Instalace Node.js selhala."
        exit 1
    fi

    if ! apt-get install -y nodejs &> /dev/null; then
        log "ERR" "Instalace Node.js selhala."
        exit 1
    fi

    # Zobrazení nainstalované verze Node.js
    node_version=$(node -v)
    log "INFO" "Node.js byl úspěšně nainstalován. Verze: $node_version"
fi

# Zjištění verze npm, pokud existuje
if command -v npm &> /dev/null; then
    npm_version=$(npm -v)
    log "INFO" "npm je již instalován. Verze: $npm_version"
else
    # Instalace npm, pokud neexistuje
    log "INFO" "Instalace npm..."
    if ! apt-get install -y npm &> /dev/null; then
        log "ERR" "Instalace npm selhala."
        exit 1
    fi

    # Zobrazení nainstalované verze npm
    npm_version=$(npm -v)
    log "INFO" "npm byl úspěšně nainstalován. Verze: $npm_version"
fi

# Nastavení cesty k souboru service
service_file="TeleFarm-OctoPrintServer.service.original"
service_path="$(realpath "$0")"


if [ ! -f "$service_directory/$service_file" ]; then
    log "ERR" "Soubor $service_file neexistuje. Zkontrolujte soubor a opakujte akci"
    exit 1
fi

# Příprava a instalace služby
cp "$service_directory/$service_file" "/etc/systemd/system/TeleFarm-OctoPrintServer.service"
NODE_PATH=$(which node)
SCRIPT_PATH="$service_directory/index.js"
sed -i "s|\[cesta/k/node\]|$NODE_PATH|g" "/etc/systemd/system/TeleFarm-OctoPrintServer.service"
sed -i "s|\[cesta/ke/skriptu\]|$SCRIPT_PATH|g" "/etc/systemd/system/TeleFarm-OctoPrintServer.service"
systemctl enable TeleFarm-OctoPrintServer.service
systemctl start TeleFarm-OctoPrintServer.service

# Zjištění stavu služby
status=$(systemctl status TeleFarm-OctoPrintServer.service)

# Zobrazení informací o instalaci
if [[ $status == *"running"* ]]; then
    log "INFO" "--- Instalace proběhla úspěšně -----------------------------------------------"
    log "INFO" "    Skript můžete spravovat pomocí následujících příkazů:"
    log "INFO" "     - sudo systemctl start TeleFarm-OctoPrintServer.service"
    log "INFO" "     - sudo systemctl stop TeleFarm-OctoPrintServer.service"
    log "INFO" "     - sudo systemctl restart TeleFarm-OctoPrintServer.service"
    log "INFO" "     - sudo systemctl status TeleFarm-OctoPrintServer.service"
    log "INFO" "     - sudo systemctl enable TeleFarm-OctoPrintServer.service"
    log "INFO" "     - sudo systemctl disable TeleFarm-OctoPrintServer.service"
    log "INFO" "     - journalctl -u TeleFarm-OctoPrintServer.service -n 100"
else
    log "ERR" "Služba TeleFarm-OctoPrintServer.service není spuštěna. Pro analýzu použijte následující příkazy:"
    log "ERR" "  - journalctl -u TeleFarm-OctoPrintServer.service -n 100"
    log "ERR" "  - sudo systemctl status TeleFarm-OctoPrintServer.service"
    log "ERR" "  - sudo systemctl start TeleFarm-OctoPrintServer.service"
    log "ERR" "  - sudo systemctl stop TeleFarm-OctoPrintServer.service"
    log "ERR" "  - sudo systemctl restart TeleFarm-OctoPrintServer.service"
fi







# -------------------------------------------------------------------------------------------------------
# LOG
# -------------------------------------------------------------------------------------------------------

    

    # Příklady použití funkce log()
    # log "INFO" "Toto je informativní zpráva."
    # log "ERR" "Toto je chybová zpráva."
    # log "WARN" "Toto je varování."

# -------------------------------------------------------------------------------------------------------
# Ověření inernetu
# -------------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------------
# Ověření zda je přihlášený root a kdo se přihlásil
# -------------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------------
# Záloha potřebných souborů
# -------------------------------------------------------------------------------------------------------

   

# -------------------------------------------------------------------------------------------------------
# Zkontrolovat .env
# -------------------------------------------------------------------------------------------------------

  
  
# -------------------------------------------------------------------------------------------------------
# Instalace NodeJS
# -------------------------------------------------------------------------------------------------------

  

# -------------------------------------------------------------------------------------------------------
# Instalace všech balíčků a závislostí z npm
# -------------------------------------------------------------------------------------------------------

    #npm install

# -------------------------------------------------------------------------------------------------------
# Vytvoření daemona
# -------------------------------------------------------------------------------------------------------


   



















# -------------------------------------------------------------------------------------------------------
# Update a upgrade
# -------------------------------------------------------------------------------------------------------

    # Aktualizace balíčkových informací
    #sudo apt-get update

    # Aktualizace nainstalovaných balíčků
    #sudo apt-get upgrade -y

























# apt get update a apt upgrade

# instalace nodejs
# instalace npm modůlů

# přepsání env souboru na .env


# záloha config.yaml - podívat se na jaké cestě jsem .....



# vytvoření uživatele autoLogin



  #curl -X PUT -d '{"alanisawesome":{"name":"Alan Turing","birthday":"June 23,1912" }}' 'https://telefarm-d66a0-default-rtdb.firebaseio.com/fireblog/users.json'




    # Získat hlavní API klíč z config.yaml (pro prvotní volání API)
    #API_KEY=$(grep -oP 'key: \K[A-F0-9]{32}' "$path_octoprintConfig")
    #echo "$API_KEY"

    # Nahrazení klíče API v konfiguračním souboru
    #sed -E -i "s/key: [A-F0-9]+/key: $API_KEY/" "$path_octoprintConfig"

    # Aktualizace ENV souboru
    #if grep -q "^OCTOPRINT_API_KEY=" "$env_file"; then
        # Pokud proměnná již existuje, aktualizuje ji
    #    sed -i "s|^OCTOPRINT_API_KEY=.*|OCTOPRINT_API_KEY=$API_KEY|" "$env_file"
    #else
        # Pokud proměnná neexistuje, přidá ji na konec souboru
    #    echo "OCTOPRINT_API_KEY=$API_KEY" >> "$env_file"
    #fi
