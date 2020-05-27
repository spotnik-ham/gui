const fs = require('fs')
const http = require('http')
const https = require('https')
const express = require('express')
const next = require('next')
const bodyParser = require('body-parser')
const api = require('./lib/api')
const config = require('./lib/config')
const update = require('./lib/update')
const dtmf = require('./lib/dtmf')
const { port, hostname } = require('./config')
const sse = require('./lib/sse')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

process.title = 'spotnik'

function restart() {
	return api.getNetwork().then(network => {
		return api.restart(network)
	})
}

app
	.prepare()
	.then(() => {
		const server = express()

		server.use(bodyParser.text())
		server.use(bodyParser.json())

		server.get('/stream', sse.init)

		server.post('/api/restart', (req, res, next) => {
			res.writeHead(202)
			res.end()
			restart().catch(next)
		})

		server.get('/api/network', (req, res, next) => {
			api
				.getNetwork()
				.then(r => {
					res.writeHead(202, { 'Content-Type': 'text/plain; charset=utf-8' })
					res.end(r.toString())
				})
				.catch(next)
		})

		server.post('/api/network', (req, res, next) => {
			api
				.setNetwork(req.body)
				.then(() => {
					res.status(202)
					res.end()
					return api.restart(req.body)
				})
				.catch(next)
		})

		server.get('/api/svxlink', (req, res, next) => {
			config
				.get()
				.then(({ callsign }) => {
					res.json(Object.assign(api.svxlink(), { node: `spotnik-${callsign}` }))
				})
				.catch(next)
		})

		server.post('/api/dtmf/:key', (req, res, next) => {
			dtmf(req.params.key)
				.then(() => {
					res.end()
				})
				.catch(next)
		})

		server.post('/api/configuration', (req, res, next) => {
			config
				.set(req.body)
				.then(() => {
					res.status(202)
					res.end()
					return restart()
				})
				.catch(next)
		})

		server.get('/api/configuration', (req, res, next) => {
			config
				.get()
				.then(conf => {
					res.json(conf)
				})
				.catch(next)
		})

		server.post('/api/reboot', (req, res, next) => {
			res.writeHead(202)
			res.end()
			api.reboot().catch(next)
		})

		server.post('/api/poweroff', (req, res, next) => {
			res.writeHead(202)
			res.end()
			api.poweroff().catch(next)
		})

		server.post('/update', (req, res, next) => {
			res.writeHead(202)
			res.end()
			update.execute(res) //.catch(next)
		})

		server.get('/update', (req, res, next) => {
			update
				.get()
				.then(conf => {
					res.json(conf)
				})
				.catch(next)
		})

		server.get('/api/:id', (req, res, next) => {
			api
				.get(req.params.id)
				.then(r => {
					res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
					res.end(r.toString())
				})
				.catch(next)
		})

		server.get('*', (req, res) => {
			return handle(req, res)
		})

		https.createServer(
			{
				key: fs.readFileSync('key.pem'),
				cert: fs.readFileSync('cert.pem'),
			},
			server
		)
			.listen(443, err => {
				if (err) {
					throw err
				}
				console.log(`> Ready on https://${hostname}:443`)
			})

		http.createServer(
			server
		)
			.listen(port, err => {
				if (err) {
					throw err
				}
				console.log(`> Ready on http://${hostname}:${port}`)
			})
	})
	.catch(err => {
		throw err
	})
