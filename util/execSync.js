const { execSync } = require('child_process');

function myExecSync(systemCommand) {

    const output = execSync(systemCommand).toString();
    
    return output;
}

module.exports = myExecSync;
  