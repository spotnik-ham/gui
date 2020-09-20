import React from 'react'
import Layout from '../components/Layout'
import fetch from '../lib/fetch'
import notie from '../lib/notie'
import Fsm from '../lib/svxlink/fsm'
import { callbackify } from 'util';

class Component extends React.Component {
	constructor() {
		super()
		this.state = { tri: "1" }

		this.handleNetworkChange = this.handleNetworkChange.bind(this)
		this.handleTriChange = this.handleTriChange.bind(this)
	}

	componentWillMount() {
		this.setState(this.props)
	}

	componentDidMount() {
		const es = new EventSource('/stream')

		const fsm = new Fsm(
			es,
			() => {
				this.setState(fsm)
			},
			this.props
		)

		es.onerror = error => {
			console.error('EventSource error', error)
		}

	}

	handleNetworkChange(evt) {
		const previousNetwork = this.state.network
		const network = evt.target.value
		const headers = new Headers()
		headers.append('Content-Type', 'text/plain; charset=utf-8')
		fetch('/api/network', {
			method: 'POST',
			headers,
			body: network,
		})
			.then(() => {
				notie.info('Restarting SvxLink...')
			})
			.catch(() => {
				this.setState({
					network: previousNetwork,
				})
			})
		this.setState({
			network,
			nodes: [],
		})
	}

	handleTriChange(evt) {

		const Tri = evt.target.value;
		this.setState({ tri: Tri });

	}

	static getInitialProps() {
		return fetch('/api/svxlink').then(res => res.json())
	}

	render() {
		if (this.state.nodes) {
			var nds = this.state.nodes.filter(() => { return true });
			if (this.state.tri === "1") {
				nds.sort();
			} else if (this.state.tri === "2") {
				nds.sort((a, b) => {
					var at = a.split(' ');
					if (at.length === 1) at[1] = 'a' + at[0];
					var bt = b.split(' ');
					if (bt.length === 1) bt[1] = 'a' + bt[0];

					if (at[1] < bt[1]) return -1;
					if (at[1] === bt[1]) return 0;
					if (at[1] > bt[1]) return 1;

				})
			}
		}

		return (
			<Layout>
				<div className="form-inline">
					<label className="sr-only" htmlFor="network">
						Network
					</label>
					<select
						required
						name="network"
						className="form-control brdr"
						value={this.state.network}
						onChange={this.handleNetworkChange}
					>
						<option value="default">Répéteur Perroquet</option>
						<option value="rrf">RRF Réseau des Répéteurs Francophones</option>
						<option value="fon">FON French Open Network</option>
						<option value="tec">TEC Salon Technique</option>
						<option value="int">INT Salon International</option>
						<option value="bav">BAV Salon Bavardage</option>
						<option value="loc">LOC Salon Local</option>
						<option value="exp">EXP Salon Expérimental</option>
						<option value="el">EL Réseau EchoLink</option>
						<option value="reg">REG Salon Régional à créer</option>
					</select>

					<select name="tri" className="form-control brdr tri" value={this.state.tri}
						onChange={this.handleTriChange}
					>
						<option value="0">Aucun tri</option>
						<option value="1">Tri sur le nom complet</option>
						<option value="2">Tri sur l&apos;indicatif seul</option>
					</select>

					{this.state.transmitter && (
						<button className="transmitter brdr bgrd">
							<strong>{this.state.transmitter.toUpperCase()}</strong>{' '}
							<img
								height="28"
								src={
									this.state.transmitter === this.props.node
										? '../static/transmit.svg'
										: '../static/receive.svg'
								}
							/>
						</button>
					)}
				</div>
				{
					<ol>

						{nds.map(name => (

							<button
								key={name}

								className={this.state.transmitter === name ? 'brdr transmitting' : 'brdr'}
							>

								{ this.state.transmitter === name && (
									<img
										height="22"
										src={
											this.state.transmitter === this.props.node
												? '../static/transmit.svg'
												: '../static/receive.svg'
										}
									/>
								)}
								{name.toUpperCase()}


							</button>
						))}
					</ol>
				}

				<style jsx>{`
					select {
						max-width: 360px;					
					}

					.tri {
						margin-left: 50px;
					}

					.brdr {
						border: 1px solid #b22222;
					}
					.bgrd {
						background-color: white;
					}

					button{
						
						display: inline-block;
						width: 150px;
						
						padding: 5px;
						border: solid grey 1px;
						border-radius: 5px;
						margin: 3px 5px;
						text-align: left;
						background-color: white;
						color: black;
						font-size: 0.95em;
					
					}
					ol {
						padding: 1% 0%;
						margin-top: 15px;
					}

					ol img {
						float: right;
						
					}

					.transmitting {
						font-weight: bold;
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
