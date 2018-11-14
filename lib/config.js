const path = require('path')
const promisify = require('util.promisify')
const readFile = promisify(require('fs').readFile)
const writeFile = promisify(require('fs').writeFile)
const ini = require('ini')
const {dir} = require('../config')
const dedent = require('dedent-js')

module.exports.get = function get() {
	return readFile(path.join(dir, 'config.json'), 'utf8').then(conf =>
		JSON.parse(conf)
	)
}

module.exports.set = function set(config) {
	const callsign = config.callsign.toUpperCase()
	const band_type = config.band_type.toUpperCase()
	const departement = config.Departement.toUpperCase()
	return readFile(path.join(dir, `svxlink.cfg`), 'utf8')
		.then(data => {
			const current = ini.decode(data)

			// callsign
			current.SimplexLogic.CALLSIGN = callsign
			if (current.ReflectorLogic) {
			current.ReflectorLogic.CALLSIGN = `${departement}-${callsign}-${band_type}`
			}
			current.LocationInfo.CALLSIGN = `${config.type}-${callsign}`

			// sql_det
			current.Rx1.SQL_DET = config.sql_det

			// ctcss_fq
			current.SimplexLogic.REPORT_CTCSS = config.ctcss_fq
			current.Rx1.CTCSS_FQ = config.ctcss_fq
			current.Tx1.CTCSS_FQ = config.ctcss_fq

			// default_lang
			current.SimplexLogic.DEFAULT_LANG = config.default_lang

			// location_latitude
			current.LocationInfo.LAT_POSITION = config.location_latitude
			// location_longitude
			current.LocationInfo.LON_POSITION = config.location_longitude
			// location_enabled
			if (config.location_enabled) {
				current.GLOBAL.LOCATION_INFO = 'LocationInfo'
			} else {
				delete current.GLOBAL.LOCATION_INFO
			}
			return Promise.all([
				writeFile(path.join(dir, `svxlink.echo`), ini.encode(current)),
				writeFile(path.join(dir, `svxlink.cfg`), ini.encode(current)),
			])
		})
		.then(() => {
			return readFile(
				path.join(dir, 'svxlink.d', 'ModuleEchoLink.conf'),
				'utf8'
			).then(data => {
				const current = ini.decode(data)

				// callsign
				current.ModuleEchoLink.CALLSIGN = `${callsign}-${config.type[1]}`
				current.ModuleEchoLink.ACCEPT_INCOMING = `^(${callsign})$`

				// echolink_password
				current.ModuleEchoLink.PASSWORD = config.echolink_password

				// default_lang
				current.ModuleEchoLink.DEFAULT_LANG = config.default_lang

				return writeFile(
					path.join(dir, 'svxlink.d', 'ModuleEchoLink.conf'),
					ini.encode(current)
				)
			})
		})
		.then(() => {
			const fetchmailrc = dedent`
			poll "${config.mail_server}"
			protocol auto
			username "${config.mail_username}"
			password "${config.mail_password}"
			mda "/usr/bin/procmail -d %s"
		`
			return writeFile(path.join(dir, 'fetchmailrc'), fetchmailrc)
		})
		.then(() => {
			return readFile(
				path.join(dir, 'svxlink.d', 'ModuleMetarInfo.conf'),
				'utf8'
			).then(data => {
				const current = ini.decode(data)

				// airport_code
				current.ModuleMetarInfo.STARTDEFAULT = config.airport_code
				current.ModuleMetarInfo.AIRPORTS = config.airport_code

				return writeFile(
					path.join(dir, 'svxlink.d', 'ModuleMetarInfo.conf'),
					ini.encode(current)
				)
			})
		})
		.then(() =>
			writeFile(path.join(dir, 'config.json'), JSON.stringify(config, null, 2))
		)
		.catch(err => console.log(err))
}
