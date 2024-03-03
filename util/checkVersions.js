// watchDataModule.js

const EventEmitter = require('events');

class WatchDataModule extends EventEmitter {
    constructor() {
        super();
        // Inicializace sledování dat nebo připojení k databázi, API, atd.
        // Předpokládejme, že data jsou získávána každých 5 sekund
        setInterval(() => {
            const newData = this.fetchData(); // Funkce pro načtení nových dat
            this.emit('data', newData); // Emitování události s novými daty
        }, 5000);
    }

    fetchData() {
        // Simulace funkce pro získání nových dat
        return { value: Math.random() };
    }
}

module.exports = WatchDataModule;

///-------------------------

// main.js

const WatchDataModule = require('./watchDataModule');

const watchData = new WatchDataModule();

// Posluchač události pro nová data
watchData.on('data', newData => {
    console.log('Nová data:', newData);
    // Zde můžete provést jakoukoli akci s novými daty, například aktualizaci UI nebo jejich zpracování
});