'use strict';

const fs = require('fs');
const path = require('path');

const TABLEPRO_BUNDLE_ID = 'com.TablePro';
const TABLEPRO_SOCKET_PATH = '/tmp/mysql.sock';

function encode (value) {
	return encodeURIComponent(value == null ? '' : String(value));
}

function buildConnectionURL (site) {
	if (!site || !site.mysql) {
		throw new Error('The Local site does not expose a valid MySQL connection.');
	}

	const username = encode(site.mysql.user);
	const password = site.mysql.password == null || site.mysql.password === ''
		? ''
		: `:${encode(site.mysql.password)}`;
	const database = encode(site.mysql.database);
	const name = encode(site.name || 'Local');

	return `mysql://${username}${password}@localhost/${database}`
		+ `?name=${name}&env=local&safeModeLevel=0`;
}

function ensureSocketSymlink (sourcePath, targetPath = TABLEPRO_SOCKET_PATH, fileSystem = fs) {
	try {
		fileSystem.statSync(sourcePath);

		let targetStat = null;
		try {
			targetStat = fileSystem.lstatSync(targetPath);
		} catch (error) {
			if (!error || error.code !== 'ENOENT') {
				throw error;
			}
		}

		if (targetStat) {
			if (!targetStat.isSymbolicLink()) {
				throw new Error(`${targetPath} exists and is not a symbolic link; refusing to replace it.`);
			}

			let pointsToSource = false;
			try {
				pointsToSource = fileSystem.realpathSync(targetPath) === fileSystem.realpathSync(sourcePath);
			} catch (_error) {
				// A broken link is safe to replace.
			}

			if (pointsToSource) {
				return { ok: true, changed: false };
			}

			fileSystem.unlinkSync(targetPath);
		}

		fileSystem.symlinkSync(path.resolve(sourcePath), targetPath);
		return { ok: true, changed: true };
	} catch (error) {
		return { ok: false, changed: false, error };
	}
}

module.exports = {
	TABLEPRO_BUNDLE_ID,
	TABLEPRO_SOCKET_PATH,
	buildConnectionURL,
	ensureSocketSymlink,
};
