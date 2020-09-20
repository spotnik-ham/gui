import React from 'react'
import formatcoords from 'formatcoords'
import Layout from '../components/Layout'
import fetch from '../lib/fetch'
import notie from '../lib/notie'


class Component extends React.Component {
	constructor() {
		super()
		this.state = {}

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleLocationChange = this.handleLocationChange.bind(this)
		this.handleGetLocation = this.handleGetLocation.bind(this)
	}

	componentWillMount() {
		this.setState(this.props.config)
	}

	static getInitialProps() {
		return fetch('/api/configuration').then(res => res.json()).then(config => {
			return { config }
		})
	}

	handleGetLocation() {
		notie.info('Looking for location')
		navigator.geolocation.getCurrentPosition(
			({ coords }) => {
				notie.info('Location acquired')
				const [latitude, longitude] = formatcoords(coords.latitude, coords.longitude)
					.format('D.M.sX', { decimalPlaces: 0 })
					.split(' ')
				this.setState({ location_latitude: latitude, location_longitude: longitude }) // eslint-disable-line camelcase
			},
			err => notie.error(err),
			{ enableHighAccuracy: true }
		)
	}

	handleLocationChange({ target }) {
		this.setState({ location_enabled: target.checked }) // eslint-disable-line camelcase
	}

	handleChange({ target }) {
		this.setState({ [target.name]: target.value.trim() })
	}

	handleSubmit(event) {
		event.preventDefault()
		const headers = new Headers()
		headers.append('Content-Type', 'application/json')
		fetch('/api/configuration', { method: 'POST', headers, body: JSON.stringify(this.state) })
			.then(() => notie.success('Saved. Restarting SvxLink...'))
			.catch(() => { })
	}

	render() {
		const value = prop => this.state[prop]
		const band_typ = {
			'6M': '6M - 6M Simplex Link',
			'10M': '10M - 10M Simplex Link',
			'T10M': 'T10M - Transponder with 10M access',
			'H': 'H - Personal Hotspot',
			'V': 'V - VHF Simplex Link',
			'U': 'U - UHF Simplex Link',
			'T': 'T - Transponder',
			'R': 'R - Repeater',
			'S': 'S - Special Link'
		}
		this.lSA818 = 'No'

		// modification du tableau des ctcss possibles à cause de SA818 qui n'en gère que 38 :
		//const ctcssFrequencies = [
		//	'67.0',	'69.3',	'71.9',	'74.4',	'77.0',	'79.7',	'82.5',	'85.4',	'88.5',
		//	'91.5',	'94.8',	'97.4',	'100.0','103.5','107.2','110.9','114.8','118.8',
		//	'123.0','127.3','131.8','136.5','141.3','146.2','150.0','151.4','156.7',
		//	'162.2','167.9','173.8','179.9','186.2','192.8','199.5','206.5','213.8',
		//	'221.3','229.1','237.1','245.5','254.1','159.8','165.5','171.3','177.3',
		//	'183.5','189.9','196.6','203.5','210.7','218.1','225.7','233.6','241.8',
		//	'250.3'
		//]

		// nouveau tableau des ctcss compatible avec SA818 :
		// la correspondance dans SA818 est la suivante : numéro d'élément sur 4 chiffres
		// exemple : le dernier élément du tableau est 0038
		const ctcssFrequencies = [
			'67', '71.9', '74.4', '77', '79.7', '82.5', '85.4', '88.5', '91.5',
			'94.8', '97.4', '100', '103.5', '107.2', '110.9', '114.8', '118.8', '123',
			'127.3', '131.8', '136.5', '141.3', '146.2', '151.4', '156.7', '162.2', '167.9',
			'173.8', '179.9', '186.2', '192.8', '203.5', '210.7', '218.1', '225.7', '233.6',
			'241.8', '250.3'
		]
		const sql_lvl = ['0', '1', '2', '3', '4', '5', '6', '7', '8']
		const lSA818 = ['No', 'Yes']

		return (
			<Layout>
				<form onSubmit={this.handleSubmit}>
					<div className="grid-container">

						<fieldset className="form-group  grid-item">
							<legend>General</legend>
							<div className="subtitle">Required</div>
							<div className="form-group">
								<label htmlFor="callsign">Call sign</label>
								<input required placeholder="Callsign" type="text" className="form-control" name="callsign" value={value('callsign')} onChange={this.handleChange} />
							</div>
							<div className="form-group">
								<label htmlFor="Departement">Department / Country <small>( see <a href="https://www.iso.org/obp/ui/fr/#search/code" target="_blank">countries list</a> </small></label>
								<input required placeholder="22" type="text" className="form-control" name="Departement" value={value('Departement')} onChange={this.handleChange} />
							</div>
							<div className="form-group">
								<label htmlFor="band_type">Type / Band <small>( V=VHF, D=10m, T=Tspdr, R=Relais ...)</small></label>
								<select required name="band_type" className="form-control" value={value('band_type')} onChange={this.handleChange}>
									{Object.entries(band_typ).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
								</select>
							</div>
							<div className="form-group">
								<label htmlFor="default_lang">Language</label>
								<select required name="default_lang" className="form-control" value={value('default_lang')} onChange={this.handleChange}>
									<option value="en_US">English</option>
									<option value="fr_FR">French</option>
								</select>
							</div>
						</fieldset>


						<fieldset className="form-group grid-item">
							<legend>Squelch</legend>
							<div className="subtitle">Required</div>
							<div className="form-group">
								<label htmlFor="sql_det">Detection method</label>
								<select required name="sql_det" className="form-control" value={value('sql_det')} onChange={this.handleChange}>
									<option value="GPIO">GPIO</option>
									<option value="CTCSS">CTCSS</option>
									<option value="VOX">VOX</option>
									<option value="SIGLEV">SIGLEV</option>
								</select>
							</div>
							<div className="form-group">
								<label htmlFor="ctcss_fq">CTCSS frequency <small>( for Spotnik Delta with SA818 <strong>use</strong> CTCSS <strong>lower than 100Hz</strong> )</small></label>
								<select required name="ctcss_fq" className="form-control" value={value('ctcss_fq')} onChange={this.handleChange}>
									{ctcssFrequencies.map(freq => <option key={freq} value={freq}>{freq}</option>)}
								</select>
							</div>
						</fieldset>

						<fieldset className="form-group grid-item">
							<legend>Location</legend>
							<div className="subtitle">Optional</div>
							<div className="form-group">
								<label className="form-check-label">
									<input className="form-check-input" type="checkbox" onChange={this.handleLocationChange} checked={value('location_enabled') ? 'checked' : ''} /> Enable
						</label>
							</div>
							<div className="form-group">
								<label htmlFor="type">Node type</label>
								<select name="type" className="form-control" value={value('type')} onChange={this.handleChange}>
									<option value="EL">Link</option>
									<option value="ER">Relay</option>
								</select>
							</div>
							<div className="form-group">
								<label htmlFor="location_latitude">Latitude <small>( in degrees minutes secondes no value &gt; 59 and no decimals ! <i>format : <strong>dd.mm.ssN</strong></i> )</small></label>
								<input placeholder="55.48.58S" type="text" className="form-control" name="location_latitude" value={value('location_latitude')} onChange={this.handleChange} />
							</div>
							<div className="form-group">
								<label htmlFor="location_longitude">Longitude <small>( in degrees minutes secondes no value &gt; 59 and no decimals ! <i>format : <strong>dd.mm.ssW</strong></i>)</small></label>
								<input placeholder="11.15.00E" type="text" className="form-control" name="location_longitude" value={value('location_longitude')} onChange={this.handleChange} />
							</div>
							<p>
								<button type="button" onClick={this.handleGetLocation}>Get automatic location</button> from
						browser or use <a href="https://aprs.fi">aprs.fi</a> for manual coordinates.
					</p>
						</fieldset>

						<fieldset className="form-group grid-item">
							<legend>EchoLink</legend>
							<div className="subtitle">Optional</div>
							<div className="form-group">
								<label htmlFor="echolink_password">Password</label>
								<input placeholder="password" type="password" className="form-control" name="echolink_password" value={value('echolink_password')} onChange={this.handleChange} />
							</div>
							<p>See <a href="http://www.echolink.org/validation/">validation</a></p>
							<div className="form-group">
								<label htmlFor="echolink_password">Proxy server</label>
								<input placeholder="example.com" type="text" className="form-control" name="echolink_proxy_server" value={value('echolink_proxy_server')} onChange={this.handleChange} />
							</div>
							<div className="form-group">
								<label htmlFor="echolink_proxy_port">Proxy port</label>
								<input placeholder="8100" type="number" className="form-control" name="echolink_proxy_port" value={value('echolink_proxy_port')} onChange={this.handleChange} />
							</div>
							<div className="form-group">
								<label htmlFor="echolink_proxy_password">Proxy password</label>
								<input placeholder="password" type="password" className="form-control" name="echolink_proxy_password" value={value('echolink_proxy_password')} onChange={this.handleChange} />
							</div>
							<p>See <a href="http://www.echolink.org/proxylist.jsp">proxy list</a></p>
						</fieldset>

						<fieldset className="form-group grid-item">
							<legend>Propagation alerts</legend>
							<div className="subtitle">Optional</div>
							<div className="form-group">
								<label htmlFor="mail_server">Mail server</label>
								<input placeholder="imap.example.com" type="text" className="form-control" name="mail_server" value={value('mail_server')} onChange={this.handleChange} />
							</div>
							<div className="form-group">
								<label htmlFor="mail_username">Mail address</label>
								<input placeholder="username@example.com" type="email" className="form-control" name="mail_username" value={value('mail_username')} onChange={this.handleChange} />
							</div>
							<div className="form-group">
								<label htmlFor="mail_password">Mail password</label>
								<input placeholder="password" type="password" className="form-control" name="mail_password" value={value('mail_password')} onChange={this.handleChange} />
							</div>
							<p>See <a href="https://f5nlg.wordpress.com/2017/05/29/doc-du-module-propagation-monitor/">documentation</a></p>
						</fieldset>

						<fieldset className="form-group grid-item">
							<legend>Meteo information</legend>
							<div className="subtitle">Optional</div>
							<div className="form-group">
								<label htmlFor="airport_code">Airport ICAO code</label>
								<input placeholder="LFRO" type="text" className="form-control" name="airport_code" value={value('airport_code')} onChange={this.handleChange} />
							</div>
							<p>See <a href="http://fr.allmetsat.com/metar-taf/france.php">airport codes</a></p>
						</fieldset>

						<fieldset className="form-group grid-item">
							<legend>Wifi</legend>
							<div className="subtitle">Optional</div>
							<div className="form-group">
								<label htmlFor="wifi_ssid">SSID</label>
								<input placeholder="ssid" type="text" className="form-control" name="wifi_ssid" value={value('wifi_ssid')} onChange={this.handleChange} />
							</div>
							<div className="form-group">
								<label htmlFor="wpa_key">WPA key</label>
								<input placeholder="clef wpa" type="text" className="form-control" name="wpa_key" value={value('wpa_key')} onChange={this.handleChange} />
							</div>
						</fieldset>

						<fieldset className="form-group grid-item">
							<legend>SA818</legend>
							<div className="subtitle">for spotnik Delta or Zeta with integrated radio only</div>
							<div className="form-group">
								<label htmlFor="Tx_qrg">TX frequency</label>
								<input placeholder="145.3250" type="text" className="form-control" name="tx_qrg" value={value('tx_qrg')} onChange={this.handleChange} />
							</div>
							<div className="form-group">
								<label htmlFor="Rx_qrg">RX frequency</label>
								<input placeholder="432.9000" type="text" className="form-control" name="rx_qrg" value={value('rx_qrg')} onChange={this.handleChange} />
							</div>
							<div className="form-group">
								<label htmlFor="sql_lvl">Squelch level</label>
								<select required name="sql_lvl" className="form-control" value={value('sql_lvl')} onChange={this.handleChange}>
									{sql_lvl.map(sql => <option key={sql} value={sql}>{sql}</option>)}
								</select>
							</div>
							<div className="form-group">
								<label htmlFor="lSA818">Are you sure you wish to program SA818 now by clicking on SAVE ?</label>
								<select required name="lSA818" className="form-control" value={value('l_818')} onChange={this.handleChange}>
									{lSA818.map(lSA818 => <option key={lSA818} value={lSA818}>{lSA818}</option>)}
								</select>

							</div>
						</fieldset>
					</div>
					<input type="submit" className="btn btn-primary btn-save" value="Save" />

				</form>
				<style jsx>{`
			
				.grid-container {
					display: grid;
					grid-template-columns: repeat(auto-fit,minmax(310px,1fr));
					grid-gap: 10px;
				}
				.grid-item {
					padding: 10px;
					border: 1px solid firebrick;
					margin: 0;
				}
				.row1 {
					padding-bottom: 0;
				}				
				.grid-item legend {
					width: auto;
					padding: 0 10px;
				}
				.center {
					text-align: center;
				}
				legend {
					margin-bottom: 0;
					color: firebrick;
				}
				.subtitle {
					position: relative;
					top: -15px;
					font-size: small;
				}
				label {
					margin: 0;
					color: firebrick;
				}
				.form-group {
					margin-bottom: 0.5rem;
				}
				.btn-save {
					margin-bottom: 50px;
}
			`}</style>

			</Layout>
		)
	}
}

export default Component
