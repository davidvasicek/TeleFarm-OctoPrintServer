#!/bin/bash

# Instalace Node.js pomocí balíčkovacího systému APT (pro Debian/Ubuntu)

curl -fsSL https://deb.nodesource.com/setup_current.x |bash - &&\
apt-get install -y nodejs

# Zobrazit nainstalovanou verzi Node.js a npm
node -v
npm -v