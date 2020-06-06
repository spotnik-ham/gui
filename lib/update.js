const fs = require('fs')
const path = require('path')
//const childProcess = require('child_process')
const promisify = require('util.promisify')

const { spawn } = require('child_process')
const chmod = promisify(require('fs').chmod)
//const { Writable } = require('stream')

//const prettyBytes = require('pretty-bytes')
const config = require('../config')
const readFile = promisify(fs.readFile)

const SSE = require('express-sse')

const sseUpd = new SSE()

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
	const url = 'https://api.github.com/repos/spotnik-ham/gui/contents/version_gui?ref=Version_4'

	const get_data = async url => {
		try {
			const response = await fetch(url);
			const json = await response.json();
			const content = json.content;
			let buff = Buffer.from(content, 'base64');
			let text = buff.toString('utf-8');
			return text
		} catch (error) {
			console.log(error);
		}
	};

	return await get_data(url);
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

	return {
		guimaj: vGIT,
		spotnikmaj: vFTP.spotnikmaj,
		version: v,
		version_gui: vg
	}
}


function majFTP(res) {
	chmod('/tmp/MAJ/MAJ.sh', 0o755)
	var maj = spawn('/tmp/MAJ/MAJ.sh')

	maj.stdout.on('data', (data) => {
		sseUpd.send(data.toString());
	});

	maj.stderr.on('data', (data) => {
		sseUpd.send(data, 'error')
	});

	maj.on('close', (code) => {
		sseUpd.send(code, 'close')
		res.end()
	});

}

module.exports.updategui = async function updategui() {

	const child = spawn('./updateGui.sh > ./updateGui.log', {
		shell: true,
		detached: true,
		stdio: 'ignore'
	});

	child.unref();

}

module.exports.get = async function get() {
	return await getVersions().catch(err => console.error('erreur update : ', err))
}

module.exports.execute = async function (req, res) {
	sseUpd.init(req, res);
	await majFTP(res);
}



