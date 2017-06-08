const express = require('express')
const next = require('next')
const bodyParser = require('body-parser')
const api = require('./lib/api')
const config = require('./lib/config')
const dtmf = require('./lib/dtmf')
const {port, hostname} = require('./config')

const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

process.title = 'spotnik'

app.prepare()
.then(() => {
	const server = express()

	server.use(bodyParser.text())
	server.use(bodyParser.json())

	server.post('/api/dtmf/:key', (req, res, next) => {
		dtmf(req.params.key).then(() => {
			res.end()
		}).catch(next)
	})

	server.post('/api/configuration', (req, res, next) => {
		config.set(req.body).then(() => {
			res.end()
		}).catch(next)
	})

	server.get('/api/configuration', (req, res, next) => {
		config.get().then(conf => {
			res.json(conf)
		}).catch(next)
	})

	server.post('/api/reboot', (req, res, next) => {
		res.writeHead(202)
		api.reboot().catch(next)
	})

	server.post('/api/poweroff', (req, res, next) => {
		res.writeHead(202)
		api.poweroff().catch(next)
	})

	server.get('/api/:id', (req, res, next) => {
		api.get(req.params.id).then(r => {
			res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
			res.end(r.toString())
		})
    .catch(next)
	})

	server.get('*', (req, res) => {
		return handle(req, res)
	})

	server.listen(port, err => {
		if (err) {
			throw err
		}
		console.log(`> Ready on http://${hostname}:${port}`)
	})
})
.catch(err => {
	throw err
})
