
// -------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------
/*  
    modul pro ukládání dat do firebase databáze
    je důležité myslet n to, že pokud nepoužívám parametr key, je důležité  
*/
// -------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------
// -------------------- knihovny --------------------
// --------------------------------------------------
const fs = require('fs');

// --------------------------------------------------
// --------------------- moduly ---------------------
// --------------------------------------------------
const {firebaseDB} = require('../firebaseInit.js');
//const { logError, logInfo, logWarning } = require('./util/log.js');

// --------------------------------------------------
// ---------------- globalní proměnné ---------------
// --------------------------------------------------

//var module = module.filename.split('/').pop();




// https://firebase.google.com/docs/database/admin/start

// ---------------------------------------------------------------------------------------------------------------------------------------------------

// Metoda pro ukládání dat do databáze
function firebaseSaveData(reference, useCustomKey = false, customKey = null, data) {
    let key;
    if (useCustomKey && customKey) {
      key = customKey;
    } else {
      // Vytvoření nového klíče pro data
      key = firebaseDB.ref().push().key;
    }
  
    // Uložení dat na specifickou cestu s klíčem
    return firebaseDB.ref(`${reference}/${key}`).set(data)
    //return firebaseDB.ref('dfdssssssssssfd').set(data)
      .then(() => {
        //logger("I", "Omluvenky", "Firebase", "Nepodařilo se zapsat do databáze");
      })
      .catch(error => {
        //logger("I", "Omluvenky", "Firebase", "Nepodařilo se zapsat do databáze");
      });
  }



// Funkce pro vytvoření posluchače
function createListener(reference, callback) {
  firebaseDB.ref(reference).on('value', (snapshot) => {
    const data = snapshot.val();
    const key = snapshot.key;
    //console.log("data " + data);
    callback(data, key);
  });
}

// Funkce pro vytvoření posluchače
function readOnce(reference, callback) {
  firebaseDB.ref(reference).once('value', (snapshot) => {
    const data = snapshot.val();
    const key = snapshot.key;
    //console.log("data " + data);
    callback(data, key);
  });
}

// Funkce pro vytvoření posluchače
function listenForNewPosts(reference, callback) {
  firebaseDB.ref(reference).on('child_added', (snapshot) => {
    const data = snapshot.val();
    const key = snapshot.key;
    //console.log("data " + data);
    callback(data, key);
  });
}


function listenForUpdatePosts(reference, callback) {
  firebaseDB.ref(reference).on('child_changed', (snapshot) => {
    const data = snapshot.val();
    const key = snapshot.key;
    //console.log("data " + data);
    callback(data, key);
  });
}

function listenForDeletePosts(reference, callback) {
  firebaseDB.ref(reference).on('child_removed', (snapshot) => {
    const data = snapshot.val();
    const key = snapshot.key;
    //console.log("data " + data);
    callback(data, key);
  });
}



  
  // Exportování metody pro ukládání dat
  module.exports = {
    firebaseSaveData, 
    createListener,
    listenForNewPosts,
    listenForUpdatePosts,
    listenForDeletePosts,
    readOnce
  };


  //firebaseDB.ref('OctoPrintServers').child("OctoPrint_" + serial.slice(-8)).child(category).child(key).set(value);