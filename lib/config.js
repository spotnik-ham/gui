const promisify = require('pify')
const http = require('http')
const readFile = promisify(require('fs').readFile)
const writeFile = promisify(require('fs').writeFile)
const os = require('os')
const humanizeDuration = require('humanize-duration')
const prettyBytes = require('pretty-bytes')
const path = require('path')
const config = require('../config')

module.exports.get = function get() {
  return readFile(path.join(config.dir, 'config.json'), 'utf8').then(conf => JSON.parse(conf))
}

module.exports.set = function set(config) {
  return writeFile(path.join(config.dir, 'config.json'), JSON.stringify(config))
}
