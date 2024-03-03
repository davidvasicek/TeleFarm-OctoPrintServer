
# Původní uživatel, ze kterého jste se přihlásil jako root
original_user=$SUDO_USER

# Získání hlavního api klíče celého octoprintu z config.yaml
API_KEY=$(cat /home/$original_user/.octoprint/config.yaml | grep key | grep -oP 'key: \K[A-F0-9]{32}')

# Získaný hlavní api klíče celého octoprintu předložím jako klíč pro volání API pro vygenerování Aplikačních klíčů. tyto Aplikační klíče budou voláný pro API
response=$(curl -s -H "Content-Type: application/json" -H "X-Api-Key: $API_KEY" -X POST -d '{"command": "generate","app": "eeedde"}' localhost/api/plugin/appkeys)
api_key1=$(echo "$response" | grep -oP '"api_key": "\K[A-F0-9]{32}')

# Získáný aplikační klíč uložím do .env souboru
sed -i 's/^OCTOPRINT_API_KEY=.*/OCTOPRINT_API_KEY='$api_key1'/' ../test/.env



current_directory="$PWD"
echo "Aktuální adresář: $current_directory/lojza.hhh"

cp /home/$original_user/.octoprint/config.yaml /home/$original_user/.octoprint/config.yaml_backup
cp $current_directory/config/octoprint_config.yaml /home/$original_user/.octoprint/config.yaml


# echo "Původní uživatel, ze kterého jste se přihlásil jako root, je: $original_user"

# echo "Původní uživatel, ze kterého jste se přihlásil jako root, je: $API_KEY"

# echo "API klíč: $api_key1"