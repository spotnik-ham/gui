const path = require('path')
const promisify = require('util.promisify')
const readFile = promisify(require('fs').readFile)
const writeFile = promisify(require('fs').writeFile)
const ini = require('ini')
const {dir} = require('../config')

module.exports.get = function get() {
  return readFile(path.join(dir, 'config.json'), 'utf8').then(conf => JSON.parse(conf))
}

module.exports.set = function set(config) {
	return Promise.all(['echo', 'fon', 'frn', 'rrf']
	.map(ext => {
		return readFile(path.join(dir, `svxlink.${ext}`), 'utf8').then((data) => {
			const current = ini.decode(data)

			// callsign
			current.SimplexLogic.CALLSIGN = config.callsign
			if (current.ReflectorLogic) {
				current.ReflectorLogic.CALLSIGN = `spotnik-${config.callsign}`
			}
			current.LocationInfo.CALLSIGN = `${config.type}-${config.callsign}`

			// sql_det
			current.Rx1.SQL_DET = config.sql_det

			// ctcss_fq
			current.SimplexLogic.CTCSS_FQ = config.ctss_fq
			current.Rx1.CTCSS_FQ = config.ctss_fq
			current.Tx1.CTCSS_FQ = config.ctss_fq

			// default_lang
			current.SimplexLogic.DEFAULT_LANG = config.default_lang

			return writeFile(path.join(dir, `svxlink.${ext}`), ini.encode(current))
		})
	}))
	.then(() => {
		return readFile(path.join(dir, 'svxlink.d', 'ModuleEchoLink.conf'), 'utf8').then((data) => {
			const current = ini.decode(data)

			// callsign
			current.ModuleEchoLink.CALLSIGN = `${config.callsign}-${config.type[1]}`
			current.ModuleEchoLink.ACCEPT_INCOMING = `^(${config.callsign})$`

			// echolink_password
			current.ModuleEchoLink.PASSWORD = config.echolink_password

			// default_lang
			current.ModuleEchoLink.DEFAULT_LANG = config.default_lang

			return writeFile(path.join(dir, 'svxlink.d', 'ModuleEchoLink.conf'), ini.encode(current))
		})
	})
	.then(() => writeFile(path.join(dir, 'config.json'), JSON.stringify(config, null, 2)))
	.catch(err => console.log(err))
}
