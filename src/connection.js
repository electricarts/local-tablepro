'use strict';

const TABLEPRO_BUNDLE_ID = 'com.TablePro';

function encode (value) {
	return encodeURIComponent(value == null ? '' : String(value));
}

function buildConnectionURL (site, port) {
	const numericPort = Number(port);
	if (!site || !site.mysql || !Number.isInteger(numericPort) || numericPort < 1 || numericPort > 65535) {
		throw new Error('The Local site does not expose a valid MySQL connection.');
	}

	const username = encode(site.mysql.user);
	const password = site.mysql.password == null || site.mysql.password === ''
		? ''
		: `:${encode(site.mysql.password)}`;
	const database = encode(site.mysql.database);
	const name = encode(site.name || 'Local');

	return `mysql://${username}${password}@127.0.0.1:${numericPort}/${database}`
		+ `?name=${name}&env=local&safeModeLevel=0`;
}

module.exports = {
	TABLEPRO_BUNDLE_ID,
	buildConnectionURL,
};
