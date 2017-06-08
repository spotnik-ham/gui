import React from 'react'
import Layout from '../components/Layout'
import DtmfPlayer from '../lib/play-dtmf'
import fetch from '../lib/fetch'

// FIXME polyfill
const g = global || window

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
		fetch(`/api/dtmf/${encodeURIComponent(key)}`, {method: 'POST'}).then(() => {
			const display = this.state.display + key
			this.setState({display})
		}).catch(() => {})
	}

	static getInitialProps() {
		return fetch(`/api/configuration`).then(res => res.json())
	}

	render() {
		const display = this.state.display || this.props.callsign
		return (
			<Layout>
				<p>Send DTMF signals to SvxLink.</p>
				<div className="keypad">
					<div className="display">{display}</div>
					{/* https://en.wikipedia.org/wiki/Dual-tone_multi-frequency_signaling#Keypad */}
					{keys.map(key => <button key={key} className="key" onClick={() => this.key(key)}>{key}</button>)}
				</div>
				<style jsx>{`
          .keypad {
            wdith: 300px;
            max-width: 300px;
            margin: auto;
          }
          .display {
						text-align: center;
            border: solid 1px black;
            @font-face {
              font-family: "D14CR";
              src: url("../static/DSEG14Classic-Regular.woff");
            }
          }
          .key {
            width: calc((100% / 4) - 2px);
            margin: 1px;
            height: 50px;
            background-color: #DDDDDD;
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
