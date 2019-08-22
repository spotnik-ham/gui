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
	'93#': 'Announce IP address over radio',
	'94#': 'Force connection to the "SPOTNIK" WiFi hotspot',
	'95#': 'Switch to NO network with Parrot',
	'96#': 'Switch to RRF network',
	'97#': 'Switch to FON network',
	'98#': 'Switch to TEC room',
	'99#': 'Switch to INT room',
	'100#': 'Switch to BAV room',
	'101#': 'Switch to LOC room',
	'102#': 'Switch to SAT room',
	'103#': 'Switch to EL network',
	'104#': 'Switch to REG room',
	'*51#': 'Announce aeronautic weather',
	'0#': 'Help',
	'*#': 'Informations',
	'#': 'Quit current module',
	'10#': 'Enable propagation monitor module',
	'1#': 'Enable parrot module',
	'2#': 'Enable EchoLink module',
	'5#': 'Enable Metar Information module',
	'7#': 'Enable FRN module',
}

class Component extends React.Component {
	constructor(...args) {
		super(...args)
		this.state = {
			display: '',
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
		fetch(`/api/dtmf/${encodeURIComponent(key)}`, {method: 'POST'})
			.then(() => {
				const display = this.state.display + key
				this.setState({display})
			})
			.catch(() => {})
	}

	sendKey(code,i) {
		if ( i < code.length){
			this.key(code[i]);
			i = i + 1;
			setTimeout(() => {
				this.sendKey(code,i);
			},250)
		}
	}
	
	sendCode(code) {
		var i = 0;
		this.sendKey(code,i);
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
				<div className="help">
					<strong>Cliquez sur une ligne pour lancer la commande :</strong>
					<ul>
						{Object.entries(cmds).map(([k, v]) => (
							<li key={k} onClick={() => this.sendCode(k)} className="commande">
								<strong>{k}</strong> {v}
							</li>
						))}
					</ul>
				</div>
				<div className="keypad fixed-bottom">
					<div className="display">{display}</div>
					{/* https://en.wikipedia.org/wiki/Dual-tone_multi-frequency_signaling#Keypad */}
					{keys.map(key => (
						<button key={key} className="key" onClick={() => this.key(key)}>
							{key}
						</button>
					))}
				</div>
					
					{/*	@font-face {
						font-family: 'D14CR';
						src: url('../static/DSEG14Modern-Regular.woff2');
					} */}
					
					<style jsx>{`
				
					.keypad {
						z-index: -1;
					}
					.help {
						position: absolute;
						height: calc(100% - (234px + 55px));
						max-height : calc(100% - 289px);
						left: 0;
						top: 55px;
						width: 100%;
						overflow: scroll;
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
						width: calc((100% / 4) - 2px);
						margin: 1px;
						height: 50px;
						background-color: #dddddd;
						border: solid 1px lightgrey;
						outline: none;
						cursor: pointer;
					}
				`}</style>
			</Layout>
		)
	}
}

export default Component
