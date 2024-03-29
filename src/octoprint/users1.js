//const myExecSync = require('../../util/execSync.js');

const dotenv = require('dotenv');
const path = require('path');
const result = dotenv.config({ path: '../../.env' });
const { logError, logInfo, logWarning } = require('../../util/log.js');
const {firebaseDB} = require('../firebase/firebaseInit.js'); // TODO pravděpodobně smazat

const callAPI = require('./api.js');
//function getStatusMainLight() { 



// chyby


// uživatel už existuje ..... "error": "A conflict happened while processing the request. The resource might have been modified while the request was being processed.

// uživatel neexistuje ....."error": "The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.
    
    var apiOutput = callAPI('GET', '', 'api/access/users');


    apiOutput.users.forEach(user => {
        // zde můžete provádět operace s jednotlivými uživateli

        const ref_ReadIntervalsrrr = firebaseDB.ref('AccessControl/Users');
        //ref_ReadIntervalsrrr.child(user.name).set(user);


        console.log(user.name); // Vypíše jméno každého uživatele
      });


      



      api = '{"servers": ["ac47a208", "ac47a20801", "ac47a20802", "ac47a20803", "ac47a20804", "ac47a20805", "ac47a20806", "f87af741"], "method": "POST", "data": {"name":"David", "password":"david", "active":true, "admin":true}, "endpoint": "access/users"}';

      const commandData = JSON.parse(api);

      const serverList = commandData.servers;
      const method = commandData.method;
      const data = commandData.data;
      const endpoint = commandData.endpoint;
    
      const myServerId = 'f87af741'; 
    
      if (serverList.includes(myServerId) || serverList.includes('-1')) {
        
        console.log('Vaše ID serveru je v seznamu serverů.');
    
        //zde zavolej komand s píkazem
        //odešli na firebase odpověď s příkazem že to přijal a že se něco stalo ...



        console.log("serverList " + serverList);
        console.log("method " + method);
        console.log("endpoint " + endpoint);

        console.log("data " + data.name);
        console.log("serverList " + data.password);
        console.log("serverList " + data.active);
        console.log("serverList " + data.admin);

        switch (endpoint) {
            
            case "access/users":
              
                switch (method) {
            
                    case "POST":
                        console.log("   API: uživatel POST .. vytvoř nového uživatele");

                        var apiOutput = callAPI('GET', '', '/api/access/users/');
                        console.log("   výsledek hledání .. " + JSON.stringify(apiOutput));

                        if (apiOutput.hasOwnProperty('error')) {
                            // Získá hodnotu klíče "error"
                            const errorValue = apiOutput.error;
                        
                            // Ověří hodnotu klíče "error"
                            if (errorValue === "The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.") {
                                console.log('Chyba: URL nebyla nalezena na serveru.');
                                // Zde můžete provést další akce v případě, že se hodnota shoduje
                                //zápis do logu a firebase
                            } else {
                                console.log('Neočekávaná chybová zpráva.');
                                // Zde můžete provést akce pro neočekávanou hodnotu chybové zprávy
                                // zápis do logu a firebase
                            }
                        } else {
                            console.log('Chybový klíč nebyl nalezen.');
                            // Zde můžete provést akce, pokud chybový klíč neexistuje
                        }





                        break;


                    case "PUT":
                        console.log("   API: uživatel PUT");
                        break;
                }
            
            
                console.log("budu dělat uživatele");
              break;
            case "hodnota2":
              console.log("String je hodnota2");
              break;
            case "hodnota3":
              console.log("String je hodnota3");
              break;
            default:
              console.log("String není žádná ze známých hodnot");
          }

      }

      function accessUser_POST(){



      }



    const ref_Users = firebaseDB.ref('AccessControl/Users');
    
    firebaseDB.ref(ref_Users).on('child_added', (snapshot) => {
      const data = snapshot.val();
      const key = snapshot.key;
      console.log("------------------------------------");
      console.log("data " + JSON.stringify(data));
      console.log("data11 " + data.servers);

      if (data.servers.includes(myServerId) || data.servers.includes('-1')) {

        console.log("   data11 jsem tuuuuuuuuu");

        var apiOutput = callAPI('GET', '', '/api/access/users/' + data.name);
        console.log("   výsledek hledání .. " + JSON.stringify(apiOutput));

        if (apiOutput.hasOwnProperty('error')) {
            // Získá hodnotu klíče "error"
            const errorValue = apiOutput.error;
        
            // Ověří hodnotu klíče "error"
            if (errorValue === "The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.") {
                console.log('   Chyba: URL nebyla nalezena na serveru.');
                // Zde můžete provést další akce v případě, že se hodnota shoduje
                //zápis do logu a firebase
                // uživatel neexistuje, musíme vytvořit nového na daném serveru

                console.log("   name " + data.name);
                console.log("   passwd " + data.passwd);
                console.log("   active " + data.active);
                console.log("   admin " + data.admin);

                var apiOutput = callAPI('POST', '"name": "' + data.name + '", "password":"' + data.passwd + '", "active":' + data.active + ', "admin":' + data.admin, 'api/access/users');
                console.log("   vytvaření nového uživatele .. " + JSON.stringify(apiOutput));

                

            } else {
                console.log('   Neočekávaná chybová zpráva.');
                // Zde můžete provést akce pro neočekávanou hodnotu chybové zprávy
                // zápis do logu a firebase
            }
        } else {
            console.log('   Chybový klíč nebyl nalezen.');
            // pokud error neexistuje, tak výsledek byl pozitivní a uživatel existuje
        }


      }

      

    });
  
  
    firebaseDB.ref(ref_Users).on('child_changed', (snapshot) => {
      const data = snapshot.val();
      const key = snapshot.key;
      console.log("data " + data);
 

    });
  
  

    firebaseDB.ref(ref_Users).on('child_removed', (snapshot) => {
      const data = snapshot.val();
      const key = snapshot.key;
      console.log("data " + data);


    });
  






      const ref_Group = firebaseDB.ref('AccessControl/Users');
      ref_Group.child('admin').once('value', function(snapshot) {
        
        user = snapshot.val();

        if(user){
            
            //console.log("snap " + JSON.stringify(user));

        }else{

            //console.log("uzivatel neexistuje "); 
        }
      
       
    
      });
      
      












      
      

    
    // Příklad volání funkce userIsExist
    var userData = 'Davida'; // Nahraďte 'jmeno_uzivatele' skutečným jménem uživatele
    userIsExist(userData)
        .then((exists) => {

            if(isInServers(serverList)){

              //je v server listu, msíš uživatele uložit

            }


            if (exists) {
                console.log("---Uživatel existuje.");
            } else {
                console.log("---Uživatel neexistuje.");
            }
        })
        .catch((error) => {
            console.error("---Chyba při ověřování existence uživatele:", error);
        });
    




      //"error": "The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again."


   // const ref_ReadIntervalsrrr = firebaseDB.ref('AccessControl/Users');
   // ref_ReadIntervalsrrr.child("Name").set(serialNumberShort);







   // return {
    //    lightStatus: apiOutput.state
    //};
//}











// -------- funkce --------------------------------------


async function userIsExist(data) {
  try {
      // Volání API
      var apiOutput = await callAPI('GET', '', '/api/access/users/' + data);

      // Zpracování odpovědi
      if (apiOutput && !apiOutput.error) {
          // Uživatel existuje
          return true;
      } else {
          // Uživatel neexistuje
          return false;
      }
  } catch (error) {
      console.error("---Chyba při volání API:", error);
      // Pokud došlo k chybě při volání API, vrátit false
      return false;
  }
}



function isInServers(serverList) {

  const myServerId = 'f87af741'; 

  if (serverList.includes(myServerId) || serverList.includes('-1')){

    return true;

  }else{

    return false;
  }
}


    
