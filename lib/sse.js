const SSE = require('express-sse')
const svxlink = require('./svxlink-log-parser')

const sse = new SSE()

;[
	'ReflectorLogic.MsgNodeList',
	'ReflectorLogic.MsgNodeLeft',
	'ReflectorLogic.MsgNodeJoined',
	'ReflectorLogic.MsgTalkerStart',
	'ReflectorLogic.MsgTalkerStop',
	'spotnik.network',
	'SimplexLogic.digit',
	'Rx1.open',
	'Rx1.closed',
	'Tx1.on',
	'Tx1.off',
].forEach(event => {
	svxlink.on(event, (...args) => {
		sse.send(args, event)
	})
})

module.exports = sse
