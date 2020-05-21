const fs = require('fs')
const os = require('os')
const path = require('path')
const childProcess = require('child_process')

const promisify = require('util.promisify')
const humanizeDuration = require('humanize-duration')
const prettyBytes = require('pretty-bytes')
const config = require('../config')
const svxlink = require('./svxlink').fsm

const exec = promisify(childProcess.exec)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

async function getFTP() {
	var resultat = {}
	const client = new ftp.Client()
	client.ftp.verbose = true
	try {
		await client.access({
			host: "ftp.f5nlg.ovh"
		})
		await client.pwd()
		await client.cd("/MAJ")
		await client.pwd()
		await client.downloadToDir('/tmp/MAJ/')
		var guimaj = await readFile('/tmp/MAJ/guimaj', 'utf8')
		var spotnikmaj = await readFile('/tmp/MAJ/spotnikmaj', 'utf8')
		resultat = {
			"guimaj": guimaj,
			"spotnikmaj": spotnikmaj
		}
	}
	catch (err) {
		console.log(err)
	}
	client.close()

	return JSON.parse(resultat)
}

async function getVersions() {
	return await getFTP()
}

module.exports.get = async function get() {
	return await getVersions()
}

