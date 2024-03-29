const myExecSync = require('../../util/execSync.js');
const callAPI = require('./api.js');





function getAliveOctoPrintService() { // Získej status zda služba Octoprintu běží
    
    var output = myExecSync('ps -ef | grep -i octoprint | grep -i python')
    return output;   
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------- Octoprint API --------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------

function getStatusMainLight() { // Získej status zda je relé hlavního osvětlení vypnuté/zapnuté
    
    var apiOutput = callAPI('GET', '', 'api/plugin/octolight?action=getState');

    return {
        lightStatus: apiOutput.state
    };
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------

function getStatusMainPower() { // Získej status zda je relé hlavního vypínání vypnuté/zapnuté

    var apiOutput = callAPI('POST', '"command":"getPSUState"', 'api/plugin/psucontrol');

    return {
        mainPowerStatus: apiOutput.isPSUOn
    };
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------

function getPrinterPrintStatus() { // Získej statusy teplot

    var output = callAPI('GET', '', 'api/printer');

    if (JSON.stringify(output).includes("Printer is not operational")) {

        return {
            statusPrinter: "Not Operational",
            TempExtruderActual: -1,
            TempExtruderTarget: -1,
            TempBedActual: -1,
            TempBedTarget: -1
        };

    } else {
        
        var printerFlag;  // flags: cancelling, finishing, paused, pausing, printing, ready, resuming, error .... not Connected

        if(output.state.flags.cancelling){
    
        printerFlag = "cancelling";
        }
        
        if(output.state.flags.finishing){
    
        printerFlag = "finishing";
        }
        
        if(output.state.flags.paused){
    
        printerFlag = "paused";
        }
        
        if(output.state.flags.pausing){
    
        printerFlag = "pausing";
        }
        
        if(output.state.flags.printing){
    
        printerFlag = "printing";
        }
        
        if(output.state.flags.ready){
    
        printerFlag = "ready";
        }
        
        if(output.state.flags.resuming){
    
        printerFlag = "resuming";
        }
        
        if(output.state.flags.error){
    
        printerFlag = "error";
        }
        
        if(output.state.flags.error){
    
        printerFlag = "error";
        }

        if (Object.keys(output.temperature).length !== 0) {

            return {
                statusPrinter: printerFlag,
                TempExtruderActual: output.temperature.tool0.actual,
                TempExtruderTarget: output.temperature.tool0.target,
                TempBedActual: output.temperature.bed.actual,
                TempBedTarget: output.temperature.bed.target
            };

        } else {

            return {
                statusPrinter: printerFlag,
                TempExtruderActual: 0,
                TempExtruderTarget: 0,
                TempBedActual: 0,
                TempBedTarget: 0
            };
        }
    }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------



// ------------------------------------------------------------------------------------------------------------------------------------------------------



// ------------------------------------------------------------------------------------------------------------------------------------------------------



// ------------------------------------------------------------------------------------------------------------------------------------------------------



// ------------------------------------------------------------------------------------------------------------------------------------------------------



// ------------------------------------------------------------------------------------------------------------------------------------------------------

// Objekt obsahující všechny funkce
const printerFunctions = {
    getAliveOctoPrintService,
    getStatusMainLight,
    getStatusMainPower,
    getPrinterPrintStatus
};

// Export objektu s funkcemi
module.exports = printerFunctions;