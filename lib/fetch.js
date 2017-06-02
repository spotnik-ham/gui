import config from '../config'
import fetch from 'isomorphic-fetch'
import {format} from 'url'
import notie from 'notie'

module.exports = function (pathname, ...args) {
  const port = typeof document !== 'undefined' ? document.location.port : config.port
  const hostname = typeof document !== 'undefined' ? document.location.hostname  : config.hostname
  return fetch(format({protocol: 'http', pathname, port, hostname}), ...args).then((res) => {
    // if (!res.ok) {
    //   throw res
    // }
    return res
  }).catch((err) => {
    if (err instanceof Response) {
      notie.alert({ type: 'error', text: `Oops!<br>Error ${err.status} - ${err.statusText}`, position: 'bottom' })
    } else {
      notie.alert({ type: 'error', text: `Oops!<br>${err.message}`, position: 'bottom'})
    }
    throw err
  })
}
