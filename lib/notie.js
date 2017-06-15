import notie from 'notie'

export default {
	success(text) {
		notie.alert({
			type: 'success',
			text,
			position: 'bottom'
		})
	},
	info(text) {
		notie.alert({
			type: 'info',
			text,
			position: 'bottom'
		})
	},
	error({code, message}) {
		notie.alert({
			type: 'error',
			text: `${code}: ${message}`,
			position: 'bottom'
		})
	}
}
