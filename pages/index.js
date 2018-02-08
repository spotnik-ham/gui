import React from 'react'
import Layout from '../components/Layout'
import fetch from '../lib/fetch'
import notie from '../lib/notie'
import Fsm from '../lib/svxlink/fsm'

class Component extends React.Component {
	constructor() {
		super()
		this.state = {}
		this.handleNetworkChange = this.handleNetworkChange.bind(this)

	}

	componentWillMount() {
		this.setState(this.props)
	}

	componentDidMount() {
		const es = new EventSource('/stream')

		const fsm = new Fsm(es, () => {
			this.setState(fsm)
		}, this.props)

		es.onerror = error => {
			console.error('EventSource error', error)
		}
	}

	handleNetworkChange(evt) {
		const previousNetwork = this.state.network
		const network1 = evt.target.value
		const headers = new Headers()

		headers.append('Content-Type', 'text/plain; charset=utf-8')
		fetch('/api/network', {
			method: 'POST',
			headers,
			body: network1
		})
		.then(() => {
			notie.info('Restarting SvxLink...')
		})
		.catch(() => {
			this.setState({
				network1: '',
			})
		})
		this.setState({
			network1,
			nodes: [],
		})
	}

	static getInitialProps() {
		return fetch('/api/svxlink').then(res => res.json())
	}

	render() {
		return (
			<Layout>
				<div className="form-inline">
					<label className="sr-only" htmlFor="network1">network1</label>
					<select required name="network1" className="form-control" value={this.state.network1} onChange={this.handleNetworkChange}>
						<option value="rrf">RRF Réseau des Répéteurs Francophones</option>
						<option value="fon">FON French Open Network</option>
						<option value="tec">TEC Salon Technique</option>
						<option value="urg">URG Salon Urgence</option>
						<option value="stv">STV Salon SSTV</option>
						<option value="cd2">CD2 Salon Codec2</option>
						<option value="el">EL Réseau EchoLink</option>
					</select>
					{this.state.transmitter && <span className="transmitter"><strong>{this.state.transmitter.toUpperCase()}</strong> <img height="28" src={this.state.transmitter === this.props.node ? '../static/transmit.svg' : '../static/receive.svg'}/></span>}
				</div>
				{(
					<ul className="list-group">
						{this.state.nodes.map(name => (
							<li key={name} className="list-group-item justify-content-between">
								{this.state.transmitter === name ? <strong>{name.toUpperCase()}</strong> : name.toUpperCase()}
								{this.state.transmitter === name && <img height="28" src={this.state.transmitter === this.props.node ? '../static/transmit.svg' : '../static/receive.svg'}/>}
							</li>
						))}
					</ul>)
				}
				<style jsx>{`
          select {
						max-width: 360px;
  				}
					ul {
						max-width: calc(100% - 14px);
						margin-top: 15px;
					}

					ul img {
						position: absolute;
						right: 15px;
					}

					.transmitter {
						position: absolute;
						right: 50px;
					}
        `}</style>
			</Layout>
		)
	}
}

export default Component
