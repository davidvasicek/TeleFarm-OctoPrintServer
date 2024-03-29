// -----------------------------------------------------------------------------------------------------------
// ------------------------------------------ Získej verze aplikací ------------------------------------------
// -----------------------------------------------------------------------------------------------------------

const myExecSync = require('../../util/execSync.js');
const callAPI = require('../octoprint/api.js');

// Získej veri NPM 
function get_versionNpm() {
    return myExecSync('npm --version');
}

// ----------------------------------------------------------------------------------------------------------------------------
// Získej veri NodeJS
function get_versionNodeJs() {
    return myExecSync('nodejs --version');
}

// ----------------------------------------------------------------------------------------------------------------------------
// Získej veri Pythonu
function get_versionPython() {
    return myExecSync('python --version');
}
  
// ----------------------------------------------------------------------------------------------------------------------------
// Získej veri OctoPi
function get_versionOctoPi() {
    return myExecSync('cat /etc/octopi_version');
}
  


// Exportuj objekt s verzemi aplikací
module.exports = {
    npm: get_versionNpm(),
    nodejs: get_versionNodeJs(),
    python: get_versionPython(),
    octopi: get_versionOctoPi(),
    octoprint: get_versionOctoPrint()
};






  // ----------------------------------------------------------------------------------------------------------------------------
  // Získej veri OctoPrint
  function get_versionOctoPrint() {
    var output = callAPI('GET', '', 'api/version');
    console.log('ouput data:', output);
    return output.server;
  }