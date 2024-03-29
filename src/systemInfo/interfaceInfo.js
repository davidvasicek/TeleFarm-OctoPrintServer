const os = require('os');

let networkInfo = {
    interface: "",
    ipAddr: "",
    macAddr: ""
};

const networkInterfaces = os.networkInterfaces();
    
// Kontrola síťových rozhraní
if ('eth0' in networkInterfaces) {
    const eth0Info = networkInterfaces['eth0'].find(info => info.family === 'IPv4');
    if (eth0Info) {
        networkInfo.interface = "eth0";
        networkInfo.ipAddr = eth0Info.address;
        networkInfo.macAddr = eth0Info.mac;
    }
}
  
if ('wlan0' in networkInterfaces) {
    const wlan0Info = networkInterfaces['wlan0'].find(info => info.family === 'IPv4');
    if (wlan0Info) {
        networkInfo.interface = "wlan0";
        networkInfo.ipAddr = wlan0Info.address;
        networkInfo.macAddr = wlan0Info.mac;
    }
}

module.exports = networkInfo;