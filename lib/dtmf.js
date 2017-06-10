const promisify = require('util').promisify
const appendFile = promisify(require('fs').appendFile)

module.exports = function dtmf(signal) {
	return appendFile('/tmp/svxlink_dtmf_ctrl_pty', signal)
}
