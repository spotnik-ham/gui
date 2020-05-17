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

				<div className="center"><strong>Enter the code, ending with a &apos;#&apos; :</strong></div>
				<div className="keypad">
					<div className="display item1">{display}</div>
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
						background-color: #fff;
						border: solid 1px firebrick;
						outline: none;
						cursor: pointer;
					}
					.key :active {
						background-color: #b2222240;
					}
					.grid-container {
						display: grid;
						grid-template-columns: auto auto auto auto;
					}
					.grid-item {
						padding: 10px;
					}
					.row1 {
						padding-bottom: 0;
					}				
					.center {
						text-align: center;
						padding-top: 75px;
					}
				`}

				</style>
			</Layout>
		)
	}
}

export default Component