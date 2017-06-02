const execa = require('execa')

module.exports = function dtmf(signal) {
  return execa('screen', ['-x', 'svxlink', '-X', 'stuff', signal])
}
