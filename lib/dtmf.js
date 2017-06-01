const execa = require('execa')

module.exports = function dtmf(str) {
  return execa('screen', ['-x svxlink', '-X stuff "e${str}"'])
}
