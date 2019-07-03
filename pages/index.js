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

	static getInitialProps() {
		return fetch('/api/svxlink').then(res => res.json())
	}

	render() {
		return (
			<Layout>
				<div className="form-inline">
					<label className="sr-only" htmlFor="network">
						Network
					</label>
					<select
						required
						name="network"
						className="form-control"
						value={this.state.network}
						onChange={this.handleNetworkChange}
					>
						<option value="rrf">RRF Réseau des Répéteurs Francophones</option>
						<option value="fon">FON French Open Network</option>
						<option value="tec">TEC Salon Technique</option>
						<option value="int">INT Salon International</option>
						<option value="bav">BAV Salon Bavardage</option>
						<option value="loc">LOC Salon Local</option>
						<option value="sat">SAT Salon Satellites</option>
						<option value="el">EL Réseau EchoLink</option>
					</select>
					{this.state.transmitter && (
						<span className="transmitter">
							<strong>{this.state.transmitter.toUpperCase()}</strong>{' '}
							<img
								height="28"
								src={
									this.state.transmitter === this.props.node
										? '../static/transmit.svg'
										: '../static/receive.svg'
								}
							/>
						</span>
					)}
				</div>
				{
					<ol>
										
						{this.state.nodes.map(name => (
							//<li	
							<button 
								key={name}
								//className="list-group-item justify-content-between"
								
							>
							
								{this.state.transmitter === name ? (
									//<strong>{name.toUpperCase()}</strong>
									<small>{name.toUpperCase()}</small>
								) : (
									name.toUpperCase()
								)}
								{this.state.transmitter === name && (
									<img
										height="28"
										src={
											this.state.transmitter === this.props.node
												? '../static/transmit.svg'
												: '../static/receive.svg'
										}
									/>
								)}
							
							</button>
						))}
					</ol>
				}
				
				<style jsx>{`
					select {
						max-width: 360px;					
					}
					button{
						
						//display: block;
						width: 130px;
						border: 1px solid grey;
						background-color: white;
						color: black;
						padding: 8px 8px;
						font-size: 14px;
						cursor: default;
						text-align: center;
						
					}
						ol {
						padding: 1% 0%;
						max-width: calc(100% - 150px);
						margin-top: 15px;
					}

					ol img {
						position: relative;
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
