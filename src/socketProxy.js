'use strict';

const net = require('net');

const proxies = new Map();

function destroyEntry (entry) {
	entry.connections.forEach((socket) => socket.destroy());
	entry.connections.clear();
	if (entry.server.listening) {
		entry.server.close();
	}
}

function closeSocketProxy (key) {
	const entry = proxies.get(key);
	if (!entry) {
		return;
	}

	proxies.delete(key);
	entry.promise.then(destroyEntry).catch(() => {});
}

function closeAllSocketProxies () {
	Array.from(proxies.keys()).forEach(closeSocketProxy);
}

function getSocketProxyPort (key, socketPath) {
	const existing = proxies.get(key);
	if (existing && existing.socketPath === socketPath) {
		return existing.promise.then((entry) => entry.port);
	}
	if (existing) {
		closeSocketProxy(key);
	}

	const entry = {
		connections: new Set(),
		port: null,
		server: null,
		socketPath,
	};

	entry.server = net.createServer((client) => {
		const upstream = net.createConnection({ path: socketPath });
		entry.connections.add(client);
		entry.connections.add(upstream);

		const forgetClient = () => entry.connections.delete(client);
		const forgetUpstream = () => entry.connections.delete(upstream);
		client.once('close', forgetClient);
		upstream.once('close', forgetUpstream);
		client.once('error', () => upstream.destroy());
		upstream.once('error', () => client.destroy());

		client.pipe(upstream);
		upstream.pipe(client);
	});

	entry.promise = new Promise((resolve, reject) => {
		const fail = (error) => {
			proxies.delete(key);
			reject(error);
		};
		entry.server.once('error', fail);
		entry.server.listen(0, '127.0.0.1', () => {
			entry.server.removeListener('error', fail);
			entry.server.on('error', (error) => {
				console.error('[local-tablepro] Socket proxy error.', error);
			});
			const address = entry.server.address();
			entry.port = address.port;
			resolve(entry);
		});
	});

	proxies.set(key, entry);
	return entry.promise.then((startedEntry) => startedEntry.port);
}

module.exports = {
	closeAllSocketProxies,
	closeSocketProxy,
	getSocketProxyPort,
};
