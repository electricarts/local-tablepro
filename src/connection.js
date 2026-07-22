'use strict';

const TABLEPRO_BUNDLE_ID = 'com.TablePro';

function encode (value) {
	return encodeURIComponent(value == null ? '' : String(value));
}

function getMySQLPort (site) {
	const rawPort = site && site.ports ? site.ports.MYSQL : undefined;
	const port = Number(rawPort);

	if (!Number.isInteger(port) || port < 1 || port > 65535) {
		return null;
	}

	return port;
}

function buildConnectionURL (site) {
	const port = getMySQLPort(site);

	if (!port || !site || !site.mysql) {
		throw new Error('The Local site does not expose a valid MySQL connection.');
	}

	const username = encode(site.mysql.user);
	const password = site.mysql.password == null || site.mysql.password === ''
		? ''
		: `:${encode(site.mysql.password)}`;
	const database = encode(site.mysql.database);
	const name = encode(site.name || 'Local');

	return `mysql://${username}${password}@127.0.0.1:${port}/${database}`
		+ `?name=${name}&env=local&safeModeLevel=0`;
}

module.exports = {
	TABLEPRO_BUNDLE_ID,
	buildConnectionURL,
	getMySQLPort,
};
