import {format} from 'url'
import _fetch from 'isomorphic-fetch'
import notie from 'notie'
import config from '../config'

export default function fetch(pathname, ...args) {
	const port = typeof document === 'undefined' ? config.port : document.location.port
	const hostname = typeof document === 'undefined' ? config.hostname : document.location.hostname
	return _fetch(format({protocol: 'http', pathname, port, hostname}), ...args).then(res => {
		if (!res.ok) {
			throw res
		}
		return res
	}).catch(err => {
		if (err instanceof Response) {
			notie.alert({type: 'error', text: `Oops!<br>Error ${err.status} - ${err.statusText}`, position: 'bottom'})
		} else {
			notie.alert({type: 'error', text: `Oops!<br>${err.message}`, position: 'bottom'})
		}
		throw err
	})
}
