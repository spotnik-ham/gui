const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const promisify = require('util.promisify')
const exec = promisify(childProcess.exec)
const chmod = promisify(require('fs').chmod)

const prettyBytes = require('pretty-bytes')
const config = require('../config')
const readFile = promisify(fs.readFile)
const Fetch = require('isomorphic-fetch')

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

async function versionguigit() {
	return await fetch('https://raw.githubusercontent.com/spotnik-ham/gui/Version_4/version_gui').then(res => {
		if (!res.ok) {
			throw res
		}
		return res
	}).catch(err => {
		if (typeof window !== 'undefined') {
			if (err instanceof Response) {
				notie.alert({ type: 'error', text: `Oops!<br>Error ${err.status} - ${err.statusText}`, position: 'bottom' })
			} else {
				notie.alert({ type: 'error', text: `Oops!<br>${err.message}`, position: 'bottom' })
			}
		}
		throw err
	})
}

async function version() {
	return await readFile(path.join(config.dir, 'version'), 'utf8').then(v => v.trim())
}

async function version_gui() {
	return await readFile("./version_gui", 'utf8').then(v => v.trim())
}

async function getVersions() {
	var vFTP = await getFTP()
	var vGIT = await versionguigit()
	var v = await version()
	var vg = await version_gui()
	console.log("version_gui : ===>>> ", vGIT)

	return {
		guimaj: vGIT,
		spotnikmaj: vFTP.spotnikmaj,
		version: v,
		version_gui: vg
	}
}

module.exports.get = async function get() {
	return await getVersions().catch(err => console.error('erreur update : ', err))
}

module.exports.execute = function () {
	chmod('/tmp/MAJ/MAJ.sh', 0o755)
	return exec('/tmp/MAJ/MAJ.sh', (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
	})
}
