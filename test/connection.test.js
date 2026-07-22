'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { buildConnectionURL, ensureSocketSymlink } = require('../lib/connection');

const site = {
	name: 'Demo & Shop',
	mysql: {
		database: 'local db',
		user: 'root@example',
		password: 'p@ss:#/%',
	},
	ports: { MYSQL: 10005 },
};

assert.strictEqual(
	buildConnectionURL(site),
	'mysql://root%40example:p%40ss%3A%23%2F%25@localhost/local%20db'
		+ '?name=Demo%20%26%20Shop&env=local&safeModeLevel=0'
);

assert.throws(() => buildConnectionURL({ ports: {} }), /valid MySQL connection/);

const testDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'local-tablepro-test-'));
const sourceOne = path.join(testDirectory, 'source-one.sock');
const sourceTwo = path.join(testDirectory, 'source-two.sock');
const target = path.join(testDirectory, 'mysql.sock');
fs.writeFileSync(sourceOne, 'one');
fs.writeFileSync(sourceTwo, 'two');

assert.deepStrictEqual(ensureSocketSymlink(sourceOne, target), { ok: true, changed: true });
assert.strictEqual(fs.realpathSync(target), fs.realpathSync(sourceOne));
assert.deepStrictEqual(ensureSocketSymlink(sourceOne, target), { ok: true, changed: false });
assert.deepStrictEqual(ensureSocketSymlink(sourceTwo, target), { ok: true, changed: true });
assert.strictEqual(fs.realpathSync(target), fs.realpathSync(sourceTwo));

fs.unlinkSync(target);
fs.writeFileSync(target, 'must not be replaced');
const refusal = ensureSocketSymlink(sourceOne, target);
assert.strictEqual(refusal.ok, false);
assert.match(refusal.error.message, /refusing to replace/);
assert.strictEqual(fs.readFileSync(target, 'utf8'), 'must not be replaced');
fs.rmSync(testDirectory, { recursive: true, force: true });

console.log('connection tests passed');
