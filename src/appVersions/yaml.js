//Load the package
const yaml = require('js-yaml');
const fs = require('fs');
const {firebaseDB} = require('../firebase/firebaseInit.js'); // TODO pravděpodobně smazat


//Read the Yaml file
const data = fs.readFileSync('/home/OctoPrint/.octoprint/config.yaml', 'utf8');
//Convert Yml object to JSON
const yamlData = yaml.load(data);


console.log(yamlData);

const ref_Permissions = firebaseDB.ref('Yaml');
ref_Permissions.child("api").set(yamlData.api);
ref_Permissions.child("appearance").set(yamlData.appearance);
ref_Permissions.child("printerProfiles").set(yamlData.printerProfiles);
ref_Permissions.child("server").set(yamlData.server);

//Write JSON to Yml
//const jsonData = JSON.stringify(yamlData);
//fs.writeFileSync('input_file.json', jsonData, 'utf8');