'use strict';

const assert = require('assert');
const { buildConnectionURL, getMySQLPort } = require('../lib/connection');

const site = {
	name: 'Demo & Shop',
	mysql: {
		database: 'local db',
		user: 'root@example',
		password: 'p@ss:#/%',
	},
	ports: { MYSQL: 10005 },
};

assert.strictEqual(getMySQLPort(site), 10005);
assert.strictEqual(getMySQLPort({ ports: { MYSQL: '10006' } }), 10006);
assert.strictEqual(getMySQLPort({
	services: { mysql: { ports: { MYSQL: [10134] } } },
}), 10134);
assert.strictEqual(getMySQLPort({
	services: { mysql: { ports: { MYSQL: '10135' } } },
}), 10135);
assert.strictEqual(getMySQLPort({ ports: { MYSQL: 70000 } }), null);
assert.strictEqual(getMySQLPort({}), null);

assert.strictEqual(
	buildConnectionURL(site),
	'mysql://root%40example:p%40ss%3A%23%2F%25@127.0.0.1:10005/local%20db'
		+ '?name=Demo%20%26%20Shop&env=local&safeModeLevel=0'
);

assert.throws(() => buildConnectionURL({ ports: {} }), /valid MySQL connection/);

console.log('connection tests passed');
