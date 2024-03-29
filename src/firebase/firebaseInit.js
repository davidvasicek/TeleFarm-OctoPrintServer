var admin = require("firebase-admin");
const dotenv = require('dotenv');
const path = require('path');
const result = dotenv.config({ path: '/home/OctoPrint/TeleFarm-OctoPrintServer/.env' });

// account key najdu v nastavení projektu v service account a tam dát  generovat nový klíč

//if (result.error) {
//  console.error('Chyba při načítání .env souboru:', result.error);
//} else {
//  console.log('.env soubor byl úspěšně načten:', result.parsed);
//}

// --------------------------------------------------------------------
// init db firebase
// --------------------------------------------------------------------

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.DATABASE_ACCOUNT_KEY)),
  databaseURL: process.env.DATABASE_URL
});

var firebaseDB = admin.database();

module.exports = {
  firebaseDB,
};
