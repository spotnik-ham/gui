const path = require('path')
const childProcess = require('child_process')
const promisify = require('util.promisify')
const exec = promisify(childProcess.exec)
const readFile = promisify(require('fs').readFile)
const writeFile = promisify(require('fs').writeFile)
const ini = require('ini')
const {dir} = require('../config')
const util = require('util')

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
	const wifi_ssid = config.wifi_ssid
	const wpa_key = config.wpa_key
	var 	Rx_ctcss = config.ctcss_fq	
	
	var 	tx_818 = config.tx_qrg
	var 	rx_818 = config.rx_qrg
	var 	sql_818 = config.sql_lvl
	const	l_818	= config.lSA818
			config.lSA818 = "No"
	
	var		Rxct	= 0
	var		sRxct	= ''
	const 	Txct	= '0000'
	var		Group	= ''
	
	
	return readFile(path.join(dir, `svxlink.cfg`), 'utf8')
		.then(data => {
			const current = ini.decode(data)

			// callsign
			current.SimplexLogic.CALLSIGN = callsign
			if (current.ReflectorLogic) {
			current.ReflectorLogic.CALLSIGN = `(${departement}) ${callsign} ${band_type}`
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
			return readFile(
				path.join('/etc','NetworkManager/system-connections', 'SPOTNIK'),
				'utf8'
			).then(data => {
				const current = ini.decode(data)
				
				// wifi
				// 
				// fichier SPOTNIK 
				// dans /etc/NetworkManager/system-connections/
				
				current.connection.id = `${wifi_ssid}`
				current.wifi.ssid = `${wifi_ssid}`
				current["wifi-security"].psk = `${wpa_key}`

				return writeFile(
					path.join('/etc','NetworkManager/system-connections', 'SPOTNIK'),
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
				.then(() => {
			//return readFile(
			//	path.join('/usr','local/sbin', 'SA818'),
			//	'utf8'
			//).then(data => {
			//	const current = ini.decode(data)
				
				
				
				// SA818 :
				// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
				// on souhaite : group =  <RxFreq>,<TxFreq>,<Txct>,<Squelch>,<Rxct>
				// option à passer , exemple : -g 446.0500,446.0500,754N,6,754N '
				// RxFreq=Rx_818, format 999.9999
				// TxFreq = Tx_818, format  999.9999
				// Rxct selon table de correspondance, format 9999
				// Squelch= Sql_lvl format  9  , minimum=2
				// Txct toujours = 0000 , format 9999
				
				
				const ctcss818 = [
					'67', '71.9', '74.4', '77', '79.7', '82.5', '85.4', '88.5', '91.5',
					'94.8', '97.4', '100', '103.5', '107.2', '110.9', '114.8', '118.8', '123',
					'127.3', '131.8', '136.5', '141.3', '146.2', '151.4', '156.7', '162.2', '167.9',
					'173.8', '179.9', '186.2', '192.8', '203.5', '210.7', '218.1', '225.7', '233.6',
					'241.8', '250.3'
				]
				
								
				rx_818 = parseFloat(rx_818).toFixed(4)				
				tx_818 = parseFloat(tx_818).toFixed(4)
				
				// formatage de Rxct sur 4 chiffres :
				// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
				Rxct  = ctcss818.indexOf(Rx_ctcss)				
				Rxct  = Rxct+10001
				sRxct	= Rxct.toString()
				sRxct = sRxct.substring(1, 5)
								
				Group = rx_818.toString()
						+ ','
						+ tx_818.toString()
						+ ','
						+ Txct.toString()
						+ ','
						+ sql_818.toString()	
						+ ','
						+ sRxct			
							
				
				
				
			if ( `${l_818}` === 'Yes') {
				try{
					exec(
					path.join('/usr','local/sbin',`818cli-prog -g ${Group} > /tmp/log818`))
					//path.join('',`nohup /usr/local/sbin/818cli-prog -g ${Group} > /tmp/log818 &
					//disown -h %+ `))
					}
				catch(err){return err;}
				}
		})
		.catch(err => console.log(err))
}
