import React from 'react'
import Layout from '../components/Layout'
import DtmfPlayer from '../lib/play-dtmf'
import fetch from '../lib/fetch'

import dtmfPerso from '../customize/dtmfCustom'
import { DTMF_Y_Custom, DCustom, DTMFDashboardsCustom } from '../customize/dtmf_num_Custom'

// FIXME polyfill
const g = global || window

// prettier-ignore
const keys = [
	'1', '2', '3', 'A',
	'4', '5', '6', 'B',
	'7', '8', '9', 'C',
	'*', '0', '#', 'D',
]

const cmds_0 = {
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
	'Switch to REG room': '104'
}

const cmds_digit = {
	'Switch to FDV room': '105',
	'Switch to NUM room': '106'
}


const cmds_1 = {
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

async function getVersion() {
	let response = await (await fetch('/getversion')).text();
	//	console.log('Fonction getVersion ====>');
	//	console.log(response);
	return response
}


class Component extends React.Component {
	constructor(...args) {
		super(...args)
		this.state = {
			display: '',
			Vspotnik: ""
		}
		if (g.AudioContext) {
			this.dtmfPlayer = new DtmfPlayer()
		}
	}

	componentWillMount() {
		getVersion().then(gV => this.setState({ Vspotnik: gV }))
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
				config.callsign = config.callsign || 'No_CALL'
				return config
			})
	}

	render() {
		const display = this.state.display || this.props.callsign
		const cmds = cmds_0 + dtmfPerso + cmds_1

		var str = "" + this.state.Vspotnik;
		let V = null;
		if (str && (str !== "")) {
			var n = str.indexOf('.');
			V = str.substr(0, n);
		}

		return (
			<Layout>

				<div className="grid-container">
					<div className="grid-item row1"><strong>Click on a row to send the command:</strong></div>
					<div className="grid-item row1"></div>
					<div className="grid-item row1"></div>
					<div className="grid-item row1">
						{!!V && (V === "4") && (<strong>List of Digital Dashboards: </strong>)}
					</div>

					<div className="grid-item">
						<ul>
							{Object.entries(cmds_0).map(([v, k]) => (
								<li key={k} onClick={() => this.sendCode(k === '#' ? '#' : k + '#')} className="commande">
									<strong>{k} : </strong> {v}
								</li>
							))}
							{(V === "4") && Object.entries(cmds_digit).map(([v, k]) => (
								<li key={k} onClick={() => this.sendCode(k === '#' ? '#' : k + '#')} className="commande">
									<strong>{k} : </strong> {v}
								</li>
							))}
							{Object.entries(dtmfPerso).map(([v, k]) => (
								<li key={k} onClick={() => this.sendCode(k === '#' ? '#' : k + '#')} className="commande">
									<strong>{k} : </strong> {v}
								</li>
							))}
							{Object.entries(cmds_1).map(([v, k]) => (
								<li key={k} onClick={() => this.sendCode(k === '#' ? '#' : k + '#')} className="commande">
									<strong>{k} : </strong> {v}
								</li>
							))}
						</ul>
					</div>
					{!!V && (V === "4") &&
						<>
							<div className="grid-item">
								<ul>
									{Object.entries(DTMF_Y_Custom).map(([v, k]) => (
										<li key={k} onClick={() => this.sendCode(k + '#')} className="commande">
											<strong>{k} : </strong> {v}
										</li>
									))}
								</ul>
							</div>
							<div className="grid-item">
								<ul>
									{Object.entries(DCustom).map(([v, k]) => (
										<li key={k} onClick={() => this.sendCode(k + '#')} className="commande">
											<strong>{k} : </strong> {v}
										</li>
									))}
								</ul>
							</div>
							<div className="grid-item">
								<ul>
									<DTMFDashboardsCustom />

								</ul>
							</div>
						</>
					}
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
						grid-template-columns: 1fr 1fr 1fr 1fr;
						background-color: #ffffff50;
					}
					.grid-item {
						padding: 10px;
					}
					.grid-item a {
						color: blue;
					}
					.grid-item ul li :hover {
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