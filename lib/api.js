// f4gbv wifi tests: 070318:
//wwwwwwwwwwwwwwwwwwwwwwwwww 
var cli = process.env.NM_CLI || 'nmcli'
var regex = /(.*)\.(.*)/g; 
//var common = require ('../common');
var getDeviceCmd = cli + ' -t  -f type,device,state,connection d';
var getAvailableWifiNetworkCmd = cli + ' -t -f ssid,mode,signal,security  d  wifi';
var getConnection = cli + ' -t -f uuid,type c';
var buf = null;
//wwwwwwwwwwwwwwwwwwwwwwwwww




const fs = require('fs')
const os = require('os')
const path = require('path')
const childProcess = require('child_process')

const promisify = require('util.promisify')
const humanizeDuration = require('humanize-duration')
const prettyBytes = require('pretty-bytes')
const config = require('../config')
const svxlink = require('./svxlink').fsm

const exec = promisify(childProcess.exec)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)




//f4gbv wifi tests 070318:
//wwwwwwwwwwwwwwwwwwwwwww

function getWifiNetworkAvailable(){
        var networks = [];
	var buf	= exec(path.join(config.dir,getAvailableWifiNetworkCmd));
	
        var str = buf.toString();
        var arr = str.split(/\r?\n/);
        for (var i = 0; i<arr.length; i++){
		var buf = exec(path.join(config.dir,getAvailableWifiNetworkCmd));
		var obj = {
                	toString : function (){
                   	return JSON.stringify(this);
                }
            };
            var row = arr[i];
            var values = row.split(':');
            var ssid = values[0];
	    if (!ssid )
                continue;
            obj.ssid = ssid;
            obj.mode = values[1];
            obj.signal = values[2];
            obj.security = values[3];
            networks.push(obj);
        }
        return networks;
}

//wwwwwwwwwwwwwwwwwwwwww




function getNetwork() {
	return readFile(path.join(config.dir, 'network'), 'utf8').then(v => v.trim())
}

function restart(network) {
	return exec(path.join(config.dir, `restart.${network}`))
}





function setNetwork(network) {
	return writeFile(path.join(config.dir, 'network'), network)
}

const stats = {
	temperature() {
		return Promise.all(config.thermal.map(p => readFile(p, 'utf8')))
    .then(temps => temps.reduce((a, b) => Number(a) + Number(b), 0) / temps.length)
    .then(temp => `${temp}°C`)
	},
	uptime() {
		return humanizeDuration(os.uptime() * 1000, {round: true, largest: 1, language: 'fr'})
	},
	hostname() {
		return os.hostname()
	},
	memory() {
		return `${prettyBytes(os.freemem())}/${prettyBytes(os.totalmem())}`
	},
	version() {
		return readFile(path.join(config.dir, 'version'), 'utf8').then(v => v.trim())
	},
	network() {
		return getNetwork()
	},
	// Not in use
	// cpu() {
	// 	const cpus = os.cpus()
	// 	return (cpus.map(cpu => cpu.speed).reduce((a, b) => a + b, 0) / cpus.length) + ` Mhz x ${cpus.length}`
	// },
	ip() {
		return Object.entries(os.networkInterfaces()).map(([k, v]) => {
			return Object.assign({}, v.find(a => a.family === 'IPv4'), {name: k})
		}).filter(int => !int.internal).map(({name, address}) => `${name}: ${address}`)
	},

//f4gbv wifi tests 070318 :
//wwwwwwwwwwwwwwwwwwwwwwwww

	wifi() {
		return getWifiNetworkAvailable()
	},
//wwwwwwwwwwwwwwwwwwwwwwwww




	datetime() {
		return new Date().toISOString()
	},
}


module.exports.getNetwork = getNetwork

module.exports.setNetwork = setNetwork

module.exports.get = function get(id) {
	return Promise.resolve(stats[id]())
}

module.exports.reboot = function () {
	return exec('systemctl reboot')
}

module.exports.poweroff = function () {
	return exec('systemctl poweroff')
}

module.exports.svxlink = function () {
	return Object.assign({}, svxlink, {nodes: [...svxlink.nodes]})
}

module.exports.restart = restart
