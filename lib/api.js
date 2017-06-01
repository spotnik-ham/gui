const pify = require('pify')
const http = require('http')
const readFile = pify(require('fs').readFile)
const os = require('os')
const humanizeDuration = require('humanize-duration')
const prettyBytes = require('pretty-bytes')
const path = require('path')
const config = require('../config')

const stats = {
  temperature() {
    return Promise.all([
      readFile('/sys/devices/virtual/thermal/thermal_zone1/temp', 'utf8'),
      readFile('/sys/devices/virtual/thermal/thermal_zone0/temp', 'utf8')
    ])
    .then(temps => temps.reduce((a, b) => +a + +b, 0) / temps.length)
    .then(temp => `${temp}°C`)
  },
  uptime () {
    return humanizeDuration(os.uptime() * 1000, {round: true, largest: 1, language: 'fr'})
  },
  hostname() {
    return os.hostname()
  },
  memory() {
    return `${prettyBytes(os.freemem())}/${prettyBytes(os.totalmem())}`
  },
  version() {
    return readFile(path.join(config.dir, 'VERSION'), 'utf8').then(v => v.trim())
  },
  network() {
    return readFile(path.join(config.dir, 'NETWORK'), 'utf8').then(v => v.trim())
  },
  cpu() {
    const cpus = os.cpus()
    return cpus.map(cpu => cpu.speed).reduce((a, b) => a + b, 0) / cpus.length + ` Mhz x ${cpus.length}`
  },
  ip() {
    return Object.entries(os.networkInterfaces()).map(([k, v]) => {
      return Object.assign({}, v.find(a => a.family === 'IPv4'), {name: k})
    }).filter(int => !int.internal).map(({name, address}) => `${name}: ${address}`)
  },
  datetime() {
    return new Date().toISOString()
  }
}

module.exports.get = function get(id) {
  return Promise.resolve(stats[id]())
}
