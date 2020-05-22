const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')

const promisify = require('util.promisify')
const prettyBytes = require('pretty-bytes')
const config = require('../config')
const readFile = promisify(fs.readFile)

const ftp = require("basic-ftp")

async function getFTP() {
	var resultat = {}
	const client = new ftp.Client()
	client.ftp.verbose = false
	try {
		await client.access({
			host: "ftp.f5nlg.ovh"
		})
		await client.pwd()
		await client.cd("/MAJ")
		await client.pwd()
		await client.downloadToDir('/tmp/MAJ/')
		var guimaj = await readFile('/tmp/MAJ/guimaj', 'utf8').then(v => v.trim()).then(v => v.replace('\n', ''))
		var spotnikmaj = await readFile('/tmp/MAJ/spotnikmaj', 'utf8').then(v => v.trim()).then(v => v.replace('\n', ''))
		resultat = {
			"guimaj": guimaj,
			"spotnikmaj": spotnikmaj
		}
	}
	catch (err) {
		console.error('Error getFTP : ', err)
	}
	client.close()

	return resultat
}

async function version() {
	return await readFile(path.join(config.dir, 'version'), 'utf8').then(v => v.trim())
}

async function version_gui() {
	return await readFile("./version_gui", 'utf8').then(v => v.trim())
}

async function getVersions() {
	var vFTP = await getFTP()
	var v = await version()
	var vg = await version_gui()

	return {
		guimaj: vFTP.guimaj,
		spotnikmaj: vFTP.spotnikmaj,
		version: v,
		version_gui: vg
	}
}

module.exports.get = async function get() {
	return await getVersions().catch(err => console.error('erreur update : ', err))
}

