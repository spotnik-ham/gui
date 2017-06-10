'use strict'

const svxlink = require('./svxlink-log-parser')

const DEBUG = false

const nodes = new Set()
const states = {
	network: '',
	nodes,
	transmit: false,
	receive: false,
	digits: [],
	talker: '',
}

function debug(...args) {
	if (DEBUG) {
		console.log(...args)
	}
}

svxlink.on('ReflectorLogic.MsgNodeList', names => {
	debug('ReflectorLogic.MsgNodeList', names)
	nodes.clear()
	names.forEach(name => {
		nodes.add(name)
	})
})

svxlink.on('ReflectorLogic.MsgNodeLeft', ([name]) => {
	debug('ReflectorLogic.MsgNodeLeft', name)
	nodes.delete(name)
})

svxlink.on('ReflectorLogic.MsgNodeJoined', ([name]) => {
	debug('ReflectorLogic.MsgNodeJoined', name)
	nodes.add(name)
})

svxlink.on('ReflectorLogic.MsgTalkerStart', ([name]) => {
	debug('ReflectorLogic.MsgTalkerStart', name)
	states.talker = name
})

svxlink.on('ReflectorLogic.MsgTalkerStop', ([name]) => {
	debug('ReflectorLogic.MsgTalkerStop', name)
	states.talker = ''
})

svxlink.on('spotnik.network', name => {
	debug('spotnik.network', name)
	states.network = name
})

svxlink.on('SimplexLogic.digit', digit => {
	debug('SimplexLogic.digit', digit)
	states.digits.push(digit)
})

svxlink.on('Rx1.open', () => {
	debug('Rx1.open')
	states.transmit = true
})

svxlink.on('Rx1.closed', () => {
	debug('Rx1.closed')
	states.transmit = false
})

svxlink.on('Tx1.on', () => {
	debug('Tx1.on')
	states.receive = true
})

svxlink.on('Tx1.off', () => {
	debug('Tx1.off')
	states.receive = false
})

module.exports = states
