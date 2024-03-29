const myExecSync = require('../../util/execSync.js');

// ---------------------------------------------------------------------------------------------------------------
// ----------------------------------------- Získej systémové informace ------------------------------------------
// ---------------------------------------------------------------------------------------------------------------



// ----------------------------------------------------------------------------------------------------------------------------
// Získej model RPi
function get_rpiModel() {
    return myExecSync('cat /sys/firmware/devicetree/base/model');
  }
  
  // ----------------------------------------------------------------------------------------------------------------------------
  // Získej OS RPi
  function get_rpiOS() {
    var RPiOS = myExecSync('cat /etc/os-release').toString().trim();
    var lines = RPiOS.split('\n');
    // Procházení každého řádku a hledání řádku obsahujícího PRETTY_NAME
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('PRETTY_NAME=')) {
            RPiOS = lines[i].split('=')[1].replace(/"/g, '').trim();
            break; // Konec procházení, jakmile je nalezena hodnota PRETTY_NAME
        }
    }
    return RPiOS;
  }
  
  // ----------------------------------------------------------------------------------------------------------------------------
  // Získej Serial info
  function get_rpiRAM() {
  
    var roundedSize = "";
  
    try {
        const stdout = myExecSync('cat /proc/meminfo').toString();
        const regex = /MemTotal:\s+(\d+)\s+kB/;
        const matches = stdout.match(regex);
        
        if (matches && matches.length === 2) {
          const memTotalKB = parseInt(matches[1]);
          roundedSize = roundMemorySize(memTotalKB);
          console.log("mem size:", memTotalKB);
          console.log("Rounded Memory Size:", roundedSize);
        } else {
          console.log("MemTotal not found in the provided text.");
        }
        
    } catch (error) {
        console.error("Chyba při získávání informací o RAM:", error);
        return "Chyba";
    }
    return roundedSize;
  }
  
  function roundMemorySize(memTotalKB) {
    const GB = 1024 * 1024;
    const MB = 1024;
  
    if (memTotalKB >= 32 * GB) {
        return '64GB';
    } else if (memTotalKB >= 16 * GB) {
        return '32GB';
    } else if (memTotalKB >= 8 * GB) {
        return '16GB';
    } else if (memTotalKB >= 4 * GB) {
        return '8GB';
    } else if (memTotalKB >= 2 * GB) {
        return '4GB';
    } else if (memTotalKB >= 1 * GB) {
        return '2GB';
    } else if (memTotalKB >= 512 * MB) {
        return '1GB';
    } else if (memTotalKB >= 256 * MB) {
        return '512MB';
    } else if (memTotalKB >= 128 * MB) {
      return '256MB';
  } else {
        return 'Less than 256MB';
    }
  }



// Exportuj objekt s verzemi aplikací
module.exports = {
    rpiModel: get_rpiModel(),
    rpiOS: get_rpiOS(),
    rpiRAM: get_rpiRAM()
};

