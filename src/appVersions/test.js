const {firebaseDB} = require('../firebase/firebaseInit.js'); // TODO pravděpodobně smazat
const getLatestGithubRelease = require('./gitHubLatestReleases.js');

const ref_Permissions = firebaseDB.ref('AppVersions/plugins');




const projects = [
    {
      "name": "OctoLight",
      "key": "OctoLight",
      "repository": "thomst08/OctoLight",
      "installURL": "https://github.com/thomst08/OctoLight/archive/master.zip"
    },
    {
      "name": "OctoPrint-UICustomizer",
      "key": "UICustomizer",
      "repository": "LazeMSS/OctoPrint-UICustomizer",
      "installURL": "https://github.com/LazeMSS/OctoPrint-UICustomizer/archive/main.zip"
    }
  ];

  projects.forEach(project => {

    ref_Permissions.child(project.key).update(project);

  });

  ref_Permissions.once('value', function(snapshot) {

    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      var value = childSnapshot.val();


      var repository = value.repository.split("/")
      getLatestGithubRelease(repository[0], repository[1], function (err, result) {
        if (err) {
            console.error("Nastala chyba: " + err.message);
        } else {
            console.log("Project: " + result.project);
            console.log("Url: " + result.url);
            console.log("Published at: " + result.published_at);
            console.log("Tag: " + result.tag);

            ref_Permissions.child(value.key).update(result);
        }
    });
    });

    
  });







  const { execSync } = require('child_process');
  var output = execSync('cat /home/OctoPrint/.octoprint/logs/octoprint.log | grep "|" | grep "= /home" | sort | uniq');
  console.log(output.toString('utf-8'));


  const lines = output.toString('utf-8').trim().split('\n');
var filteredLines = lines.filter(line => !line.includes('(bundled)'));
filteredLines = filteredLines.map(line => line.split(' = ')[0]);
filteredLines = filteredLines.map(line => line.split('|  ')[1]);



// TODO tady bude do každé tiskárny vložin seznam pluginu a jejich verze. bude metoda set, aby to aktualizovalo všechny pluginy 
// TODO co to udělá když nějaký plugin odinstaluju? 

const ref_verzePluginu = firebaseDB.ref('OctoPrintServers/OctoPrint_f87af741/AppVersions/Plugins');
//ref_verzePluginu.delete ...execSync. 
filteredLines.forEach(line => {


  var split = line.split(" (");

  console.log("..." + split[0].replace(/\s+/g, '_') + "...");
  console.log("..." + split[1].split(")")[0] + "...");

  ref_verzePluginu.child(split[0].replace(/\s+/g, '_')).set(split[1].split(")")[0]);
});

console.log(filteredLines);
console.log('---------------');
console.log(filteredLines.join('\n'));

//process.exit(0); 