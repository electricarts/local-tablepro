import * as LocalMain from '@getflywheel/local/main';

const { START_SOCKET_PROXY } = require('./channels');
const {
	closeAllSocketProxies,
	closeSocketProxy,
	getSiteSocketPath,
	getSocketProxyPort,
} = require('./socketProxy');

export default function (context: LocalMain.AddonMainContext): void {
	LocalMain.addIpcAsyncListener(START_SOCKET_PROXY, async (siteId: string) => {
		const socketPath = getSiteSocketPath(context.environment.userDataPath, siteId);
		return getSocketProxyPort(siteId, socketPath);
	});

	context.hooks.addAction('siteStopped', (site) => {
		if (site && site.id) {
			closeSocketProxy(site.id);
		}
	});

	context.process.once('exit', closeAllSocketProxies);
}
