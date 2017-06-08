const fs = require('fs')
const os = require('os')
const path = require('path')

const promisify = require('util.promisify')
const humanizeDuration = require('humanize-duration')
const prettyBytes = require('pretty-bytes')
const config = require('../config')

const readFile = promisify(fs.readFile)

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
		return readFile(path.join(config.dir, 'network'), 'utf8').then(v => v.trim())
	},
	// cpu() {
	// 	const cpus = os.cpus()
	// 	return (cpus.map(cpu => cpu.speed).reduce((a, b) => a + b, 0) / cpus.length) + ` Mhz x ${cpus.length}`
	// },
	ip() {
		return Object.entries(os.networkInterfaces()).map(([k, v]) => {
			return Object.assign({}, v.find(a => a.family === 'IPv4'), {name: k})
		}).filter(int => !int.internal).map(({name, address}) => `${name}: ${address}`)
	},
	datetime() {
		return new Date().toISOString()
	},
}

module.exports.get = function get(id) {
	return Promise.resolve(stats[id]())
}
