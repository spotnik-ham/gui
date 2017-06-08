module.exports = class DtmfPlayer {
	constructor(audioContext) {
		this.oscillator1 = null
		this.oscillator2 = null
		this.audioContext = null
		this.audioFile = null
		this._baseUrl = ''

		if (audioContext) {
			this.audioContext = audioContext
			return
		}
		const ContextClass = (
			window.AudioContext ||
			window.webkitAudioContext ||
			window.mozAudioContext ||
			window.oAudioContext ||
			window.msAudioContext
		)

		if (ContextClass) {
			this.audioContext = new ContextClass()
		} else {
			this.audioFile = new Audio()
		}
	}

	set baseUrl(baseUrl) {
		this._baseUrl = baseUrl
	}

	playTone(freq1, freq2) {
		this.stop()
		const gainNode = this.audioContext.createGain()
		gainNode.gain.value = 0.1

		this.oscillator1 = this.audioContext.createOscillator()
		this.oscillator1.type = 'sine'
		this.oscillator1.frequency.value = freq1
		this.oscillator1.connect(gainNode, 0, 0)
		gainNode.connect(this.audioContext.destination)

		this.oscillator2 = this.audioContext.createOscillator()
		this.oscillator2.type = 'sine'
		this.oscillator2.frequency.value = freq2
		this.oscillator2.connect(gainNode)
		gainNode.connect(this.audioContext.destination)

		this.oscillator1.start(0)
		this.oscillator2.start(0)
	}

	play(key) {
		if (this.audioContext === null) {
			return this.playDtmfFallback(key)
		}
		switch (String(key)) {
			case '1':
				this.playTone(697, 1209)
				break
			case '2':
				this.playTone(697, 1336)
				break
			case '3':
				this.playTone(697, 1477)
				break
			case '4':
				this.playTone(770, 1209)
				break
			case '5':
				this.playTone(770, 1336)
				break
			case '6':
				this.playTone(770, 1477)
				break
			case '7':
				this.playTone(852, 1209)
				break
			case '8':
				this.playTone(852, 1336)
				break
			case '9':
				this.playTone(852, 1477)
				break
			case '*':
				this.playTone(941, 1209)
				break
			case '0':
				this.playTone(941, 1336)
				break
			case '#':
				this.playTone(941, 1477)
				break
			case 'A':
				this.playTone(697, 1633)
				break
			case 'B':
				this.playTone(770, 1633)
				break
			case 'C':
				this.playTone(852, 1633)
				break
			case 'D':
				this.playTone(941, 1633)
				break
			default:
				throw new Error(`${key} is not a valid DTMF signal.`)
		}
	}

	stop() {
		if (this.oscillator1 !== null) {
			this.oscillator1.disconnect()
		}
		if (this.oscillator2 !== null) {
			this.oscillator2.disconnect()
		}
		if (this.audioFile !== null) {
			this.stopFallback()
		}
	}

	playDtmfFallback(key) {
		switch (String(key)) {
			case '*':
				key = 'star'
				break
			case '#':
				key = 'hash'
				break
			default:
				throw new Error(`${key} is not a valid DTMF signal.`)
		}
		this.audioFile.removeEventListener('playing', this.onAudioFileplaying)
		this.audioFile.src = `${this._baseUrl}${key}.mp3`
		this.audioFile.play()
	}

	stopFallback() {
		const audioFile = this.audioFile
		if (audioFile.duration > 0 && !audioFile.paused) {
			audioFile.pause()
		} else {
			if (this.onAudioFileplaying === undefined) {
				this.onAudioFileplaying = () => {
					audioFile.pause()
				}
			}
			audioFile.addEventListener('playing', this.onAudioFileplaying)
		}
	}

	close() {
		if (this.audioContext !== null) {
			this.audioContext.close()
		}
	}

}
