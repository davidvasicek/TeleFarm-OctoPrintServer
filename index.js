// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------- IMPORT KNIHOVEN -------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------




// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------- IMPORT MODULŮ -------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const {firebaseDB} = require('./src/firebase/firebaseInit.js'); // TODO pravděpodobně smazat
const appInfo = require('./src/systemInfo/appInfo.js');
const hwSwInfo = require('./src/systemInfo/hwSwInfo.js');
const interfaceInfo = require('./src/systemInfo/interfaceInfo.js');
const {setEnvValue} = require('./config/envConf.js'); // spuštění pocesu s env
const {serial} = require('./util/deviceID.js');
const { logError, logInfo, logWarning } = require('./util/log.js');
const printerInfo = require('./src/octoprint/printerInfo.js');

require('./src/octoprint/groupControl.js');

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------- GLOBÁLNÍ PROMĚNNÉ -------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const serialNumberShort = serial.slice(-8);
const ref_ReadIntervalsrrr = firebaseDB.ref('OctoPrintServers/OctoPrint_'+ serialNumberShort);

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------- INIT -------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

logInfo(module.filename.split('/').pop(), "------------------- STARTUP -------------------");
console.log("--------------------------------------- NODEMON START NEW CHANGES ---------------------------------------");

const isFirstRun = process.env.firstRun === 'true'; // Načtění hodnoty firstRun z konfiguračního souboru

if (isFirstRun) { // pokud je skript pouštěn zcela poprvé
    
  ref_ReadIntervalsrrr.child("SystemInfo").child("Name").set(serialNumberShort);
  ref_ReadIntervalsrrr.child("SystemInfo").child("Description").set(serialNumberShort);
  ref_ReadIntervalsrrr.child("SystemInfo").child("firstRegistration").set(Date.now());
  
  ref_ReadIntervalsrrr.child("Group").child("GroupId").set(-1);

  // možná notifikace o registraci nového serveru
  // měl by ses podívat, zda už je uživatel admin vytvořen - možná by stačilo admina a autologin vložit uložit do db, ono se to samo syncne
  // mrknout se, zda by nešl vygenerovat nová api klíč už při initu a ten pak vložit do env souboru
  // někde v db musí být položka is waiting for reboot, protože někdy nemůžu dělat operace když tiskarna tiskne. 
  // ...
  // ...

  setEnvValue("firstRun", "false"); // Nastavení firstRun na false v konfiguračním souboru
}

ref_ReadIntervalsrrr.child("SystemInfo").update(hwSwInfo);
ref_ReadIntervalsrrr.child("SystemInfo").update(appInfo);
ref_ReadIntervalsrrr.child("SystemInfo").update(interfaceInfo);



// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------- ZÍSKÁVÁNÍ DAT V URČITÉM INTERVALU -------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

let intervalMap = {}; // Objekt pro ukládání intervalů

const ref_ReadIntervals1 = firebaseDB.ref('Settings/ReadIntervals');

ref_ReadIntervals1.once('value', function(snapshot) {
  
  snapshot.forEach(function(childSnapshot) {
    var key = childSnapshot.key;
    var value = childSnapshot.val();
    setOrUpdateInterval(key, value);
  });
});

// Nastavení listeneru pro sledování změn
ref_ReadIntervals1.on('child_changed', function(snapshot) {
  const key = snapshot.key;
  const value = snapshot.val();
  setOrUpdateInterval(key, value);
});

// Funkce pro nastavení nebo aktualizaci intervalu
function setOrUpdateInterval(key, value) {
  if (intervalMap.hasOwnProperty(key)) {
    clearInterval(intervalMap[key]);
  }

  intervalMap[key] = setInterval(() => {
    switch (key) {

      case 'LightStatus':
        // Volání funkce pro stav světla
        const mainLightStatus = printerInfo.getStatusMainLight();
        ref_ReadIntervalsrrr.child("StatusAndControl").update(mainLightStatus);
        break;

      case 'MainPower':
        // Volání funkce pro hlavní napájení
        const mainPowerStatus = printerInfo.getStatusMainPower();
        ref_ReadIntervalsrrr.child("StatusAndControl").update(mainPowerStatus);
        break;

      case 'PrinterInfo':
        // Volání funkce pro informace o tiskárně
        const printerPrintStatus = printerInfo.getPrinterPrintStatus();
        ref_ReadIntervalsrrr.child("StatusAndControl").update(printerPrintStatus);
        break;

      case 'StatusOnline':
        // Volání funkce pro online stav
        if(printerInfo.getAliveOctoPrintService()){
          ref_ReadIntervalsrrr.child("StatusAndControl").update({aliveOctoPrintService: Date.now()});
        }
        break;

      case 'StatusNetwork':
        // Volání funkce pro stav sítě
        break;

      case 'StatusTemperatures':
        // Volání funkce pro teploty
        break;

      case 'aliveOctoPrintService':
        // Volání funkce pro živost OctoPrint služby
        break;

      case 'InterfaceInfoInterval':
        // Volání funkce pro interval aktualizace verze aplikace
        //console.log("Volání funkce pro stav síťového rozhraní");
        ref_ReadIntervalsrrr.child("SystemInfo").update(interfaceInfo);
        break;

      case 'appVersionInterval':
        // Volání funkce pro interval aktualizace verze aplikace
        //console.log("Volání funkce pro stav světla");
        ref_ReadIntervalsrrr.child("SystemInfo").update(appInfo);
        break;

      default:
        console.error(`Neznámý klíč: ${key}`);
    }
  }, value);
}



























/*    TODO list

  - reference dát do env? 
  - dodělat groupu
  - dodělat gpio
  - udělat API






práva pro env rw-r--r-- 644




*/


//{"servers": ["8g98", "7r87", "4r54", "65r6", "3r23"], "command": "lololo"}
//{"servers": ["-1"], "command": "lololo"}

const timeForStatusReadingRefgg = firebaseDB.ref('Settings/callAPI');
timeForStatusReadingRefgg.on('value', function(snapshot) {

  console.log('22222222222222222 serers:', snapshot.val());

  const commandData = JSON.parse(snapshot.val());

  const serverList = commandData.servers;
  const command = commandData.command;

  console.log('22222222222222222 serers:', serverList);
  console.log('22222222222222222 Nový příkaz:', command);


  const myServerId = '8g98'; 

  if (serverList.includes(myServerId) || serverList.includes('-1')) {
    
    console.log('Vaše ID serveru je v seznamu serverů.');

    //zde zavolej komand s píkazem
    //odešli na firebase odpověď s příkazem že to přijal a že se něco stalo ...
    
  }


});


























// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


/*Verze: - NodeJS, NPM, OctoPi, OctoPrint, Python,
Informace o systému: - model RPi, OS RPi, velikost RAM Rpi

 Statusy
  - zda octoprint běží - neustále posílá čas
  - status osvětlení - relé
  - status hlavního napájení - relé
  - status zda tiskárna tiskne
  - status aktuálních teplot 4teploty
  - status, zda je tiskárna připojena k octoprint
*/

// TODO udělat funkce na voláni api a volání systémových informací
// TODO získávat poslední verze aplikací











const nameOfThisScript = "systémové informace a aktualizace informací a načítání hodnot";
const scriptVersion = "1.0.0";


















const {createListener, firebaseSaveData, listenForNewPosts, listenForUpdatePosts, listenForDeletePosts, readOnce} = require('./src/firebase/realtimeDatabase/firebaseHelper.js');

//firebaseHelper.firebaseSaveData("lolo", false, false ,"llll")

// Reference k datům ve vaší databázi (změňte podle potřeby)
const databaseReference = '/ttt/ab';
const databaseReference1 = '/ttt/bc';
const databaseReference2 = '/ttt';

// Zavolejte funkci createListener s referencí a zpětnou funkcí
createListener(databaseReference, (data) => {
  console.log('Nová data:', data);
  // Zde můžete provést akce s novými daty
});

createListener(databaseReference1, (data) => {
  console.log('Nová data1:', data);
  // Zde můžete provést akce s novými daty
});

listenForNewPosts(databaseReference2, (data, key) => {
  console.log('přidaná data: ---------------------');
  console.log('přidaná data:', data);
  console.log('přidaná data:', key);
  console.log('přidaná data: ---------------------');
  // Zde můžete provést akce s novými daty
});

listenForUpdatePosts(databaseReference2, (data, key) => {
  console.log('upravena data: ---------------------');
  console.log('upravena data:', data);
  console.log('upravena data:', key);
  console.log('upravena data: ---------------------');
  // Zde můžete provést akce s novými daty
});

listenForDeletePosts(databaseReference2, (data, key) => {
  console.log('smazana data: ---------------------');
  console.log('smazana data:', data);
  console.log('smazana data:', key);
  console.log('smazana data: ---------------------');
  // Zde můžete provést akce s novými daty
});


































//firebaseDB.ref('Settings').child("ReadIntervals").child("LightStatus").set(2500);
//firebaseDB.ref('Settings').child("ReadIntervals").child("MainPower").set(1400);
//firebaseDB.ref('Settings').child("ReadIntervals").child("PrinterInfo").set(5000);
//firebaseDB.ref('Settings').child("ReadIntervals").child("StatusNetwork").set(10000);
//firebaseDB.ref('Settings').child("ReadIntervals").child("StatusOnline").set(5000);
//firebaseDB.ref('Settings').child("ReadIntervals").child("StatusTemperatures").set(1000);








// -----------------------------------------------------------------------------------------------------------
// ------------------------------------- Získej informace o 3D tiskárně --------------------------------------
// -----------------------------------------------------------------------------------------------------------

// TODO od verze 10.0.0 octoprintu toto vytahovat ze souboru M115.txt









// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------- Funkce ---------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------





// ----------------------------------------------------------------------------------------------------------------------------
// Informace o tiskárně a verzi firmware
function get_infoPrinter() {

  // TODO - získávat data
  const text = `FIRMWARE_NAME:Prusa-Firmware 3.12.2 based on Marlin FIRMWARE_URL:https://github.com/prusa3d/Prusa-Firmware PROTOCOL_VERSION:1.0 MACHINE_TYPE:Prusa i3 MK3S EXTRUDER_COUNT:1 UUID:00000000-0000-0000-0000-000000000000`;

  const keys = [
    "FIRMWARE_NAME",
    "FIRMWARE_URL",
    "PROTOCOL_VERSION",
    "MACHINE_TYPE",
    "EXTRUDER_COUNT",
    "UUID"
  ];

  const json = {};

  keys.forEach(key => {
    const regex = new RegExp(`${key}:(.*?)(?=\\s${keys.join('|')}\\s|$)`);
    const match = text.match(regex);
    if (match) {
      json[key] = match[1];
    }
  });

  //firebaseSaveData("PrinterInfo", "FIRMWARE_NAME", json.FIRMWARE_NAME);
  //firebaseSaveData("PrinterInfo", "PROTOCOL_VERSION", json.PROTOCOL_VERSION);
  //firebaseSaveData("PrinterInfo", "MACHINE_TYPE", json.MACHINE_TYPE);
  //firebaseSaveData("PrinterInfo", "EXTRUDER_COUNT", json.EXTRUDER_COUNT);
}

























































// --------------------------------------------------------------------------------------------
// --------------------------------------- mqtt example ---------------------------------------
// --------------------------------------------------------------------------------------------
/*
const mqttModule = require('./mqttModule');

const topics = ['topic1', 'topic2', 'topic3']; // Pole témat, ke kterým se chcete připojit

// Připojení k MQTT brokeru a odběr zpráv z více témat
mqttModule.connect(topics);

// Publikování zprávy
mqttModule.publish('topic1', 'Hello MQTT World!');

*/


// --------------------------------------------------------------------------- EXAMPLES ---------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------
// --------------------------------------- log example ---------------------------------------
// --------------------------------------------------------------------------------------------
/*
const { logError, logInfo, logWarning } = require('./log');

//var module = module.filename.split('/').pop();

// Volání funkcí pro logování chyby, informace a varování
logError(module.filename.split('/').pop(), "Toto je chybová zpráva.");
logInfo(module.filename.split('/').pop(), "Toto je informační zpráva.");
logWarning(module.filename.split('/').pop(), "Toto je varovná zpráva.");
*/

// --------------------------------------------------------------------------------------------
// --------------------------------------- env example ---------------------------------------
// --------------------------------------------------------------------------------------------
/*
require('./config/envConf.js'); // spuštění pocesu s env
process.env.DB_USERNAME; // Přístup k proměnné z env souboru
*/

