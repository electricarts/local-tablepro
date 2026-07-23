'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { tableProBundleId, tableProDatabaseUrl } = require('../lib/database-url');
const { siteMysqlSocket, tableProInstallations } = require('../lib/local-paths');
const { LoopbackBridgePool } = require('../lib/loopback-bridge');
const { parseOpenDatabaseRequest } = require('../lib/protocol');

function start(server, target) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(target, () => {
      server.off('error', reject);
      resolve();
    });
  });
}

function stop(server) {
  return new Promise((resolve) => server.close(resolve));
}

function exchange(port, value) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: '127.0.0.1', port }, () => socket.write(value));
    socket.once('data', (chunk) => {
      socket.end();
      resolve(chunk.toString());
    });
    socket.once('error', reject);
  });
}

async function run() {
  const request = parseOpenDatabaseRequest({
    credentials: {
      database: 'local db',
      password: 'p@ss:#/%',
      user: 'root@example',
    },
    siteId: 'site_ID-123',
    siteName: 'Demo & Shop',
  });

  assert.equal(tableProBundleId(), 'com.TablePro');
  assert.equal(
    tableProDatabaseUrl(request, 12345),
    'mysql://root%40example:p%40ss%3A%23%2F%25@127.0.0.1:12345/local%20db'
      + '?env=local&name=Demo+%26+Shop&safeModeLevel=0&sslmode=require',
  );
  assert.throws(() => tableProDatabaseUrl(request, 0), /TCP port range/);
  assert.throws(() => parseOpenDatabaseRequest({}), /credentials/);
  assert.equal(
    siteMysqlSocket('/tmp/local-data', 'site_ID-123'),
    path.resolve('/tmp/local-data/run/site_ID-123/mysql/mysqld.sock'),
  );
  assert.throws(() => siteMysqlSocket('/tmp/local-data', '../escape'), /site ID/);
  assert.deepEqual(tableProInstallations('/Users/example'), [
    '/Applications/TablePro.app',
    '/Applications/Setapp/TablePro.app',
    '/Users/example/Applications/TablePro.app',
  ]);

  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'tablepro-v2-'));
  const unixSocket = path.join(directory, 'mysql.sock');
  const unixServer = net.createServer((client) => client.pipe(client));
  const bridges = new LoopbackBridgePool();

  try {
    await start(unixServer, unixSocket);
    const port = await bridges.acquire('site-one', unixSocket);
    assert.equal(await bridges.acquire('site-one', unixSocket), port);
    assert.equal(await exchange(port, 'independent implementation'), 'independent implementation');
  } finally {
    await bridges.releaseAll();
    await stop(unixServer);
    fs.rmSync(directory, { force: true, recursive: true });
  }

  console.log('v2 tests passed');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
