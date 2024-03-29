const fs = require('fs');
const os = require('os');
const dotenv = require('dotenv');
const path = require('path');
const result = dotenv.config({ path: '../.env' });
const { logError, logInfo, logWarning } = require('../util/log.js');

if (result.error) {
  logError(module.filename.split('/').pop(), 'Chyba při načítání .env souboru ', result.error);
} else {
  logInfo(module.filename.split('/').pop(), '.env soubor byl úspěšně načten ', result.parsed);
}

function setEnvValue(key, value) {

    // read file from hdd & split if from a linebreak to a array
    const ENV_VARS = fs.readFileSync(".env", "utf8").split(os.EOL);

    // find the env we want based on the key
    const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
        return line.match(new RegExp(key));
    }));

    // replace the key/value with the new value
    ENV_VARS.splice(target, 1, `${key}=${value}`);
    // write everything back to the file system
    fs.writeFileSync(".env", ENV_VARS.join(os.EOL));
}

module.exports = {setEnvValue};
