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
	'Announce aeronautic weather': '*51',
	'Help': '0',
	'Informations': '*',
	'Quit current module': '#',
	'Enable propagation monitor module': '10',
	'Enable / Disable RRF Raptor': '200',
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
		fetch(`/api/dtmf/${encodeURIComponent(key)}`, { method: 'POST' })
			.then(() => {
				const display = this.state.display + key
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
					<div className="grid-item">
						<ul>
							{Object.entries(cmds).map(([v, k]) => (
								<li key={k} onClick={() => this.sendCode(k === '#' ? '#' : k + '#')} className="commande">
									<strong>{k} : </strong> {v}
								</li>
							))}
						</ul>
					</div>

				</div>

				{/*	@font-face {
		font-family: 'D14CR';
		src: url('../static/DSEG14Modern-Regular.woff2');
	} */}

				<style jsx>{`


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
		grid-template-columns: 1fr;
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
