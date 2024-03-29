const {firebaseDB} = require('../firebase/firebaseInit.js');
const {serial} = require('../../util/deviceID.js');

var groupId = -1;

// ---------------------- Získej ID skupiny do které daný server patří ----------------------
const ref_Group = firebaseDB.ref('OctoPrintServers/OctoPrint_' + serial.slice(-8) + '/Group/GroupId');
ref_Group.once('value', function(snapshot) {
  groupId = snapshot.val();


    if(groupId == -1){

        console.log('Není členem');

    }else{

        console.log('Členem skupiny: ' + groupId);

    }

    const dbRef = firebaseDB.ref('OctoPrintServers');
    const filteredRef = dbRef.orderByChild('Group/GroupId').equalTo(groupId);
    
    filteredRef.once('value', function(snapshot) {
    
        

        snapshot.forEach(function(childSnapshot) {
    
            var key = childSnapshot.key;
            var value = childSnapshot.child('StatusAndControl').child('aliveOctoPrintService').val();//.child('aliveOctoPrintService');

            console.log("snap " + JSON.stringify(value)); 

        });
    });
    
    
    


});









