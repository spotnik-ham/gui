const Parser = require('./parser')
const Fsm = require('./fsm')

const parser = new Parser('/tmp/svxlink.log')
const fsm = new Fsm(parser)

module.exports.parser = parser
module.exports.fsm = fsm
