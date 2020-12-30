const SSE = require('./express-sse-evm')
const {parser, fsm} = require('./svxlink') // eslint-disable-line no-unused-vars

const sse = new SSE()

;[
	'ReflectorLogic.MsgNodeList',
	'ReflectorLogic.MsgNodeLeft',
	'ReflectorLogic.MsgNodeJoined',
	'ReflectorLogic.MsgTalkerStart',
	'ReflectorLogic.MsgTalkerStop',
	'spotnik.network',
	// 'SimplexLogic.digit',
	// 'Rx1.open',
	// 'Rx1.closed',
	// 'Tx1.on',
	// 'Tx1.off',
].forEach(event => {
	parser.on(event, data => {
		sse.send(data || [], event)
	})
})

module.exports = sse