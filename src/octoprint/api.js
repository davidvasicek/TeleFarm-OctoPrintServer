/*

    OctoPrintAPI

    Modul OctoPrintAPI je vytvořen pro snadné a efektivní volání interního API od OctoPrintu. 
    Tento modul poskytuje funkce pro různé operace, jako je získání stavu tiskárny, 
    teplot, spuštění tisku a další.

*/

// import
const { execSync } = require('child_process');

// globálni proměnné
const APIKey = process.env.OCTOPRINT_API_KEY; 
console.error("API: ", APIKey);

// body
function call_RestAPI(methods, body, endpoint) {

    const header_ContentType = '-H "Content-Type: application/json"';
    const header_APIKey = '-H "X-Api-Key: ' + APIKey + '"';
    methods = '-X ' + methods;
  
    if(body.trim() === ''){
  
        body = '';
    }else{
  
      body = '-d \'{' + body + '}\'';
    }
  
    endpoint = 'http://localhost/' + endpoint;
  
    const curlCommand = 'curl -s ' + header_ContentType + " " + header_APIKey + " " + methods + " " + body + " " + endpoint;
    var start = Date.now();
    var output = execSync(curlCommand);
    var stop = Date.now();
    //console.log(stop-start);
    console.log(endpoint + " ... " + curlCommand);

    return JSON.parse(output);
  }

module.exports = call_RestAPI;