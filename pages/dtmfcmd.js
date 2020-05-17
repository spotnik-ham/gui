import React from 'react'
import Layout from '../components/Layout'
import DtmfPlayer from '../lib/play-dtmf'
import fetch from '../lib/fetch'

// FIXME polyfill
const g = global || window

// prettier-ignore
const keys = [
	'1', '2', '3', 'A',
	'4', '5', '6', 'B',
	'7', '8', '9', 'C',
	'*', '0', '#', 'D',
]

const cmds = {
	'Announce IP address over radio': '93',
	'Switch to NO network with Parrot': '95',
	'Switch to RRF network': '96',
	'Switch to FON network': '97',
	'Switch to TEC room': '98',
	'Switch to INT room': '99',
	'Switch to BAV room': '100',
	'Switch to LOC room': '101',
	'Switch to EXP room': '102',
	'Switch to EL network': '103',
	'Switch to REG room': '104',
	'Switch to FDV room': '105',
	'Switch to NUM room': '106',
	'Announce aeronautic weather': '*51',
	'Help': '0',
	'Informations': '*',
	'Quit current module': '#',
	'Enable propagation monitor module': '10',
	'Enable / Disable RRF Raptor': '200',
}

const cmds_2 = {
	'YSF FRANCE': '3000',
	'YSF IDF': '3001',
	'YSF XLX 208': '3002',
	'YSF Room-ZIT': '3003',
	'YSF Centre France': '3004',
	'YSF Alpes': '3005',
	'YSF Wallonie': '3006',
	'YSF Haut de France': '3007',
	'YSF Linux': '3008',
	'YSF Test': '3009',
	'YSF FRA Wide': '3010',
	'YSF Emcom FR': '3012',
	'YSF NordOuest': '3029',
	'YSF Canada Fr': '3030',
	'YSF Cq Canada': '3031',
	'YSF DMRQ Ca': '3032',
	'YSF Nantes': '3044',
	'YSF HB9VD': '3066',
	'YSF Wirex': '3090',
	'YSF FON': '3097',
	'YSF INTERNATIONAL-RRF': '3099',
	'P25 France': '10208',
	'P25 Canada Fr': '40721',
	'NXDN France': '65208',
}

const cmds_3 = {
	'DMR France': '208',
	'DMR Urgence': '2080',
	'DMR IDF': '2081',
	'DMR Nord Ouest': '2082',
	'DMR Nord Est': '2083',
	'DMR Sud Est': '2084',
	'DMR Sud Ouest': '2085',
	'DMR DOM-TOM': '2089',
	'DMR 208 00': '20800',
	'DMR 208 25': '20825',
	'DMR 208 44': '20844',
	'DMR 208 54': '20854',
	'DMR 208 60': '20860',
	'DMR 208 67': '20867',
	'DMR 208 79': '20879',
	'D-Star 933C': '933',
}

class Component extends React.Component {
	constructor(...args) {
		super(...args)
		this.state = {
			display: ''
		}
		if (g.AudioContext) {
			this.dtmfPlayer = new DtmfPlayer()
		}
	}

	vibrate() {
		if (navigator.vibrate) {
			navigator.vibrate(50)
		}
	}

	play(key) {
		if (!this.dtmfPlayer) {
			return
		}
		this.dtmfPlayer.play(key)
		setTimeout(() => {
			this.dtmfPlayer.stop()
		}, 150)
	}

	key(key) {
		this.vibrate()
		this.play(key)
		fetch(`/api/dtmf/${encodeURIComponent(key)}`, { method: 'POST' })
			.then(() => {
				var display = this.state.display + key
				if (display.length > 12) {
					display = display.substring(1);
				}
				this.setState({ display })
			})
			.catch(() => { })
	}

	sendKey(code, i) {
		if (i < code.length) {
			this.key(code[i]);
			i = i + 1;
			setTimeout(() => {
				this.sendKey(code, i);
			}, 250)
		}
	}

	sendCode(code) {
		var i = 0;
		this.sendKey(code, i);
	}

	static getInitialProps() {
		return fetch(`/api/configuration`)
			.then(res => res.json())
			.then(config => {
				config.callsign = config.callsign || '5P07N1K'
				return config
			})
	}

	render() {
		const display = this.state.display || this.props.callsign
		return (
			<Layout>

				<div className="grid-container">
					<div className="grid-item row1"><strong>Click on a row to send the command:</strong></div>
					<div className="grid-item row1"></div>
					<div className="grid-item row1"></div>
					<div className="grid-item row1"><strong>List of Digital Dashboards: </strong></div>
					<div className="grid-item">
						<ul>
							{Object.entries(cmds).map(([v, k]) => (
								<li key={k} onClick={() => this.sendCode(k === '#' ? '#' : k + '#')} className="commande">
									<strong>{k} : </strong> {v}
								</li>
							))}
						</ul>
					</div>
					<div className="grid-item">
						<ul>
							{Object.entries(cmds_2).map(([v, k]) => (
								<li key={k} onClick={() => this.sendCode(k + '#')} className="commande">
									<strong>{k} : </strong> {v}
								</li>
							))}
						</ul>
					</div>
					<div className="grid-item">
						<ul>
							{Object.entries(cmds_3).map(([v, k]) => (
								<li key={k} onClick={() => this.sendCode(k + '#')} className="commande">
									<strong>{k} : </strong> {v}
								</li>
							))}
						</ul>
					</div>
					<div className="grid-item">
						<ul>
							<li><a href="http://rrf.f5nlg.ovh/" target="_blank">99 International Site du RRF</a></li>
							<li><a href="http://ysf-france.fr" target="_blank">3000 YSF France</a></li>
							<li><a href="http://ysf-idf.f1tzo.com:81" target="_blank">3001 YSF Ile de France</a></li>
							<li><a href="https://xlx208.f5kav.fr/index.php" target="_blank">3002 YSF XLX208</a></li>
							<li><a href="http://151.80.143.185/zit/YSFReflector-Dashboard/" target="_blank">3003 YSF Room ZIT</a></li>
							<li><a href="http://ysf-centre-france.f1tzo.com:81/" target="_blank">3004 YSF Centre France</a></li>
							<li><a href="http://ysf-alpes.f4gve.net/" target="_blank">3005 YSF Alpes</a></li>
							<li><a href="http://www.ysfwallonie.net/ " target="_blank">3006 YSF Wallonie</a></li>
							<li><a href="https://srv.hambox.fr/hdf-dashboard/" target="_blank">3007 YSF Haut de France</a></li>
							<li><a href="http://vps.hambox.fr/ysf-linux-fr/" target="_blank">3008 YSF Linux</a></li>
							<li><a href="http://vps731279.ovh.net/" target="_blank">3009 YSF Test</a></li>
							<li><a href="http://ns3294400.ovh.net/YSFDashboard/" target="_blank">3010 YSF Fra Wide</a></li>
							<li><a href="http://38.110.97.161/" target="_blank">3030 YSF Canada Fr </a></li>
							<li><a href="https://cqcanada.420hamradio.network/" target="_blank">3031 YSF Cq Canada</a></li>
							<li><a href="http://dmrq.ca/" target="_blank">3032 YSF Dmrq Canada</a></li>
							<li><a href="http://www.f5ore.dyndns.org/" target="_blank">3044 YSF Nantes </a></li>
							<li><a href="http://reflector.hb9vd.ch/ysf/" target="_blank">3066 YSF HB9VD </a></li>
							<li><a href="http://151.80.143.185/WXF/YSFReflector-Dashboard/index.php/" target="_blank">3090 YSF FRa Wirex </a></li>
							<li><a href="http://ysf-fon-gateway.f1tzo.com:81/" target="_blank">3097 YSF FON </a></li>
							<li><a href="http://ysf-international-rrf.f1tzo.com:81/" target="_blank">3099 YSF International-RRF</a></li>

							<p></p>

							<li><a href="http://ysf-france.fr/p25/ " target="_blank">10208 P25 France</a></li>

							<p></p>

							<li><a href="http://ysf-france.fr/nxdn/" target="_blank">65208 NXDN France</a></li>

							<p></p>

							<li><a href="http://164.132.195.103/ipsc/index.html#" target="_blank">DMR IPSC2 France</a></li>
							<li><a href="https://brandmeister.network/?page=lh" target="_blank">DMR BM</a></li>

							<p></p>

							<li><a href="http://dcs033.xreflector.net/index.php" target="_blank">933 D-Star DCS033 </a></li>

						</ul>
					</div>
				</div>

				{/*	@font-face {
						font-family: 'D14CR';
						src: url('../static/DSEG14Modern-Regular.woff2');
					} */}

				<style jsx>{`
				
					.keypad {
						z-index: -1;
						padding: 0 10px;
						display: grid;
						justify-content: center;
						grid-template-columns: auto auto auto auto; /*Make the grid smaller than the container*/
						grid-gap: 10px;
						/*background-color: #2196F3;*/
						padding: 10px;
					}
					.item1 {
						grid-column-start: 1;
						grid-column-end: 5;
					}
					.help {
						position: absolute;
						height: calc(100% - (234px + 55px));
						max-height : calc(100% - 289px);
						left: 10px;
						top: 55px;
						width: 100%;
						overflow: scroll;
						padding: 0 10px;
					}
					.commande{
						cursor: pointer;
					}
					.display {
						background-color: white;
						text-align: center;
						border: solid 1px black;
						font-family: 'D14CR', serif;
					}
					.key {
						/*width: calc((100% / 4) - 2px);*/
						margin: 1px;
						/*height: 50px;*/
						background-color: #dddddd;
						border: solid 1px lightgrey;
						outline: none;
						cursor: pointer;
					}
					.grid-container {
						display: grid;
						grid-template-columns: auto auto auto auto;
						background-color: #ffffff50;
					}
					.grid-item {
						padding: 10px;
					}
					.grid-item a {
						color: blue;
					}
					.grid-item li:hover {
						font-weight: bold;
					}
					.row1 {
						padding-bottom: 0;
					}				
					.center {
						text-align: center;
					}
				`}</style>
			</Layout>
		)
	}
}

export default Component