'use strict';

const assert = require('assert');
const fs = require('fs');
const net = require('net');
const os = require('os');
const path = require('path');
const { buildConnectionURL } = require('../lib/connection');
const { closeAllSocketProxies, getSocketProxyPort } = require('../lib/socketProxy');

const site = {
	id: 'site-id',
	name: 'Demo & Shop',
	mysql: {
		database: 'local db',
		user: 'root@example',
		password: 'p@ss:#/%',
	},
};

assert.strictEqual(
	buildConnectionURL(site, 12345),
	'mysql://root%40example:p%40ss%3A%23%2F%25@127.0.0.1:12345/local%20db'
		+ '?name=Demo%20%26%20Shop&env=local&safeModeLevel=0'
);
assert.throws(() => buildConnectionURL({ ports: {} }, 12345), /valid MySQL connection/);
assert.throws(() => buildConnectionURL(site, 70000), /valid MySQL connection/);

function listen (server, target) {
	return new Promise((resolve, reject) => {
		server.once('error', reject);
		server.listen(target, () => {
			server.removeListener('error', reject);
			resolve();
		});
	});
}

function close (server) {
	return new Promise((resolve) => server.close(resolve));
}

function roundTrip (port, message) {
	return new Promise((resolve, reject) => {
		const client = net.createConnection({ host: '127.0.0.1', port }, () => client.write(message));
		client.once('data', (data) => {
			client.end();
			resolve(data.toString());
		});
		client.once('error', reject);
	});
}

async function main () {
	const testDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'local-tablepro-test-'));
	const socketPath = path.join(testDirectory, 'mysql.sock');
	const socketServer = net.createServer((client) => client.pipe(client));

	try {
		await listen(socketServer, socketPath);
		const proxyPort = await getSocketProxyPort('test-site', socketPath);
		assert.ok(proxyPort > 0 && proxyPort <= 65535);
		assert.strictEqual(await getSocketProxyPort('test-site', socketPath), proxyPort);
		assert.strictEqual(await roundTrip(proxyPort, 'ping'), 'ping');
	} finally {
		closeAllSocketProxies();
		await close(socketServer);
		fs.rmSync(testDirectory, { recursive: true, force: true });
	}

	console.log('connection tests passed');
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
