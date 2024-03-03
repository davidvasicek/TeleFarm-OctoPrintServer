const { execSync } = require('child_process');



try {
    const stdout = execSync('cat /proc/cpuinfo').toString();
    const lines = stdout.split('\n');

    // Procházení řádek a hledání řádku obsahujícího "Serial"
    for (const line of lines) {
        if (line.includes('Serial')) {
            // Oddělení klíče a hodnoty pomocí dvojtečky
            const parts = line.split(':');
            if (parts.length === 2) {
                // Získání sériového čísla (odstranění mezer na začátku a konci)
                serial = parts[1].trim();
                console.log('Sériové číslo:', serial.slice(-8));
                break; // Když se sériové číslo najde, ukončíme procházení
            }
        }
    }
} catch (error) {
    console.error("Chyba při získávání informací o RAM:", error);
    return "Chyba";
}


module.exports = {
    serial,
  };
  

