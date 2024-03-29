const fs = require('fs');

const logFileName = "log.txt";

// ------------------------- LOG Functions ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function logError(logModule, logMessage) {
    logFunction('E', logModule, logMessage);
}

function logInfo(logModule, logMessage) {
    logFunction('I', logModule, logMessage);
}

function logWarning(logModule, logMessage) {
    logFunction('W', logModule, logMessage);
}

function logFunction(logType, logModule, logMessage) {
    var message = getTime() + " | " + logType + " | " + logModule + " | " + logMessage;

    fs.writeFile(logFileName, "\n" + message, { flag: 'a+' }, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    });
}

// ------------------------- Helper Function ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function getTime() {
    let date_ob = new Date();
    let year = date_ob.getFullYear();
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let date = ("0" + date_ob.getDate()).slice(-2);
    let hours = ("0" + (date_ob.getHours())).slice(-2);
    let minutes = ("0" + (date_ob.getMinutes())).slice(-2);
    let seconds = ("0" + (date_ob.getSeconds())).slice(-2);
    return year + "." + month + "." + date + " " + hours + ":" + minutes + ":" + seconds;
}

module.exports = { logError, logInfo, logWarning };