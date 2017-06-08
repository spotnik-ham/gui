import React from 'react'
import Layout from '../components/Layout'
import fetch from '../lib/fetch'
// Import api from '../lib/api'

// https://github.com/zeit/next.js/issues/2069
// import api from '../lib/api'
// const isServer = typeof window === 'undefined'
// const get = isServer
//   ? (id) => api.get(id)
//   : (id) => fetch(`/api/${id}`).then(res => res.text())
function get(id) {
	return fetch(`/api/${encodeURIComponent(id)}`).then(res => res.text())
}

const Index = props => (
	<Layout>
		<div className="list-group">
			<div className="list-group-item flex-column align-items-start">
				<h5>network</h5>
				<p>{props.network}</p>
			</div>
			<div className="list-group-item flex-column align-items-start">
				<h5>uptime</h5>
				<p>{props.uptime}</p>
			</div>
			<div className="list-group-item flex-column align-items-start">
				<h5>hostmane</h5>
				<p>{props.hostname}</p>
			</div>
			<div className="list-group-item flex-column align-items-start">
				<h5>memory</h5>
				<p>{props.memory}</p>
			</div>
			{/* <div className="list-group-item flex-column align-items-start">
				<h5>cpu</h5>
				<p>{props.cpu}</p>
			</div> */}
			<div className="list-group-item flex-column align-items-start">
				<h5>ip</h5>
				<p>{props.ip}</p>
			</div>
			<div className="list-group-item flex-column align-items-start">
				<h5>time</h5>
				<p>{props.datetime}</p>
			</div>
			<div className="list-group-item flex-column align-items-start">
				<h5>version</h5>
				<p>{props.version}</p>
			</div>
			<div className="list-group-item flex-column align-items-start">
				<h5>temperature</h5>
				<p>{props.temperature}</p>
			</div>
		</div>
	</Layout>
)

Index.getInitialProps = async function () {
	return {
		uptime: await get('uptime'),
		hostname: await get('hostname'),
		memory: await get('memory'),
		// cpu: await get('cpu'),
		ip: await get('ip'),
		datetime: await get('datetime'),
		version: await get('version'),
		network: await get('network'),
		temperature: await get('temperature'),
	}
}

export default Index
