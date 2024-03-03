
const {firebaseDB} = require('./util/firebaseInit.js');
const {serial} = require('./util/deviceID.js');


console.log("---------------------- NODEMON START NEW CHANGES ----------------------")

const scriptVersion = "1.0.0";


console.log("deviceID " + serial);













/*

const usersRef = firebaseDB.ref('users2');
usersRef.set({
  alanisawesome: {
    date_of_birth: 'June 23, 1913',
    full_name: 'Alan Turing'
  },
  gracehop: {
    date_of_birth: 'December 9, 1906',
    full_name: 'Grace Hopper'
  }
});
*/