//const myExecSync = require('../../util/execSync.js');

const dotenv = require('dotenv');
const path = require('path');
const result = dotenv.config({ path: '../../.env' });
const { logError, logInfo, logWarning } = require('../../util/log.js');
const {firebaseDB} = require('../firebase/firebaseInit.js'); // TODO pravděpodobně smazat
const callAPI = require('./api.js');

//https://docs.octoprint.org/en/master/api/access.html#sec-api-access-datamodel-users-updateuserrequest


//curl -s -H "Content-Type: application/json" -H "X-Api-Key: 5BCFC4F0F3994C8FB131FB02F0AA0A60" -X POST -d '{"name": "Davidddrrr", "password":"123456789a", "active":true, "groups":["guests", "readonly"]}' http://localhost/api/access/users 

//curl -s -H "Content-Type: application/json" -H "X-Api-Key: 5BCFC4F0F3994C8FB131FB02F0AA0A60" -X PUT -d '{"active":true, "groups":["guests", "admins"]}' http://localhost/api/access/users/Davidddrrr

//curl -s -H "Content-Type: application/json" -H "X-Api-Key: 5BCFC4F0F3994C8FB131FB02F0AA0A60" -X POST -d '{"name": "Davidddrrr", "password":"123456789a", "active":true, "groups":["guests", "admins"]}' http://localhost/api/access/users 
//curl -s -H "Content-Type: application/json" -H "X-Api-Key: 5BCFC4F0F3994C8FB131FB02F0AA0A60" -X POST -d '{"name": "Daviddd", "password":"123456789a", "active":true, "groups":["guests"]}' http://localhost/api/access/users 
//curl -s -H "Content-Type: application/json" -H "X-Api-Key: 5BCFC4F0F3994C8FB131FB02F0AA0A60" -X DELETE http://192.168.0.241/api/access/users/David


//curl -s -H "Content-Type: application/json" -H "X-Api-Key: 5BCFC4F0F3994C8FB131FB02F0AA0A60" -X GET http://192.168.0.241/api/access/permissions
//curl -s -H "Content-Type: application/json" -H "X-Api-Key: 5BCFC4F0F3994C8FB131FB02F0AA0A60" -X GET http://192.168.0.241/api/access/groups
//curl -s -H "Content-Type: application/json" -H "X-Api-Key: 5BCFC4F0F3994C8FB131FB02F0AA0A60" -X GET http://192.168.0.241/api/access/users


//admins, guests
//guests
//readonly, guests
//users, guests

//curl -s -H "Content-Type: application/json" -H "X-Api-Key: 5BCFC4F0F3994C8FB131FB02F0AA0A60" -X PUT -d '{"active":true, "groups":["admins"]}' http://localhost/api/access/users/Davidddrrr
//curl -s -H "Content-Type: application/json" -H "X-Api-Key: 5BCFC4F0F3994C8FB131FB02F0AA0A60" -X PUT -d '{"active":true, "groups":["guests"]}' http://localhost/api/access/users/Davidddrrr
//curl -s -H "Content-Type: application/json" -H "X-Api-Key: 5BCFC4F0F3994C8FB131FB02F0AA0A60" -X PUT -d '{"active":true, "groups":["readonly"]}' http://localhost/api/access/users/Davidddrrr
//curl -s -H "Content-Type: application/json" -H "X-Api-Key: 5BCFC4F0F3994C8FB131FB02F0AA0A60" -X PUT -d '{"active":true, "groups":["users"]}' http://localhost/api/access/users/Davidddrrr


const ref_Groups = firebaseDB.ref('AccessControl/Groups');
var apiOutput = callAPI('GET', '', 'api/access/groups');
apiOutput.groups.forEach(function(object) {
  ref_Groups.child(object.key).set(object);
});

const ref_Permissions = firebaseDB.ref('AccessControl/Permissions');
var apiOutput = callAPI('GET', '', 'api/access/permissions');
apiOutput.permissions.forEach(function(object) {
  ref_Permissions.child(object.key).set(object);
});



const myServerId = 'f87af741';
let usersListInDB = []; // Pole pro ukládání uživatelů z databáze


// Reference na databázi Firebase
const ref_Users = firebaseDB.ref('AccessControl/Users');

// Posluchač pro načtení dat z databáze Firebase
ref_Users.on('value', function(snapshot) {
  usersListInDB = [];
  snapshot.forEach(function(childSnapshot) {
    var key = childSnapshot.key;
    var value = childSnapshot.val();

    if (value.servers.includes(myServerId) || value.servers.includes('-1')) {
      usersListInDB.push(value);
    }
  });

  // Zavolání funkce pro ověření uživatelských seznamů
  verifyUserLists(usersListInDB);
});


/**
 * Funkce pro načtení uživatelů z databáze a jejich porovnání s uživateli z OctoPrint serveru.
 * @param {Array} dbList - Seznam uživatelů z databáze
 */
function verifyUserLists(dbList) {
  const usersListInOctoPrintServer = []; // Pole pro ukládání uživatelů z OctoPrint serveru

  // Načtení uživatelů z OctoPrint serveru
  const apiOutput = callAPI('GET', '', 'api/access/users');
  apiOutput.users.forEach(object => {
    usersListInOctoPrintServer.push(object);
  });

  console.log('Seznam uživatelů db:', usersListInDB);
  console.log('---------------------------------------');
  console.log('Seznam uživatelů serv:', usersListInOctoPrintServer);

  // Porovnání seznamů uživatelů
  const namesList1 = dbList.map(objekt => objekt.name);
  const namesList2 = usersListInOctoPrintServer.map(objekt => objekt.name);
  const missingInList2 = namesList1.filter(jmeno => !namesList2.includes(jmeno));
  const extraInList2 = namesList2.filter(jmeno => !namesList1.includes(jmeno));

  console.log("Chybějící prvky v OctoPrintu:", missingInList2);
  console.log("Prvky navíc v OctoPrintu:", extraInList2);

  if (missingInList2.length === 0 && extraInList2.length === 0) {
    console.log("Vše sedí, provádí se kontrola změn u uživatelů.");
    compareObjects(usersListInDB, usersListInOctoPrintServer);
  } else {
    // Přidání chybějících prvků do OctoPrintu
    missingInList2.forEach(jmeno => {
      console.log(`Prvek '${jmeno}' chybí v seznamu 2.`);
      callAPI('POST', `"name": "${jmeno}", "password":"123654ll", "active": true, "groups":["guests", "admins"]`, 'api/access/users');
    });

    // Smazání přebytečných prvků z OctoPrintu
    extraInList2.forEach(jmeno => {
      console.log(`Prvek '${jmeno}' je navíc v seznamu 2.`);
      callAPI('DELETE', '', `api/access/users/${jmeno}`);
    });

    // Rekurzivní volání funkce pro ověření seznamů
    verifyUserLists(usersListInDB);
  }
}

/**
 * Porovná objekty uživatelů a provádí případné aktualizace.
 * @param {Array} list1 - Seznam uživatelů z databáze
 * @param {Array} list2 - Seznam uživatelů z OctoPrint serveru
 */
function compareObjects(list1, list2) {
  let count = 0;
  list1.forEach(objekt1 => {
    const foundObject = list2.find(objekt2 => objekt2.name === objekt1.name);

    console.log(`Objekt '${objekt1.name}' nalezen v obou seznamech.`);

    const keysToCompare = ["active", "groups"];
    const keysMatch = compareSpecificKeys(objekt1, foundObject, keysToCompare);

    if (!keysMatch) {
      console.log("Hodnoty specifických klíčů se neshodují.");

      // Aktualizace uživatele
      const quotedList = objekt1.groups.map(item => `"${item}"`);
      const joinedString = quotedList.join(', ');

      callAPI('PUT', `"active": ${objekt1.active}, "groups": [${joinedString}]`, `api/access/users/${objekt1.name}`);
      count++;
    }
  });

  if (count > 0) {
    // Rekurzivní volání funkce pro ověření seznamů
    verifyUserLists(usersListInDB);
  }
}

/**
 * Porovná konkrétní klíče objektů.
 * @param {Object} obj1 - První objekt
 * @param {Object} obj2 - Druhý objekt
 * @param {Array} keys - Klíče k porovnání
 * @returns {boolean} - True, pokud jsou klíče stejné, jinak false
 */
function compareSpecificKeys(obj1, obj2, keys) {
  let isTheSame = true;

  if (!areListsEqual(obj1.groups, obj2.groups)) {
    isTheSame = false;
  }

  if (obj1.active !== obj2.active) {
    isTheSame = false;
  }

  return isTheSame;
}

/**
 * Porovná, zda jsou seznamy stejné.
 * @param {Array} list1 - První seznam
 * @param {Array} list2 - Druhý seznam
 * @returns {boolean} - True, pokud jsou seznamy stejné, jinak false
 */
function areListsEqual(list1, list2) {
  if (list1.length !== list2.length) {
    return false;
  }

  const sortedList1 = list1.slice().sort();
  const sortedList2 = list2.slice().sort();

  for (let i = 0; i < sortedList1.length; i++) {
    if (sortedList1[i] !== sortedList2[i]) {
      return false;
    }
  }

  return true;
}