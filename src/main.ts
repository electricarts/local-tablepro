import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { promisify } from 'node:util';
import * as LocalMain from '@getflywheel/local/main';
import { tableProBundleId, tableProDatabaseUrl } from './database-url';
import { siteMysqlSocket, tableProInstallations } from './local-paths';
import { LoopbackBridgePool } from './loopback-bridge';
import { CHANNELS, parseOpenDatabaseRequest } from './protocol';

const runFile = promisify(execFile);

export default function registerMain(context: LocalMain.AddonMainContext): void {
  const bridges = new LoopbackBridgePool();
  const hasTablePro = () => tableProInstallations(context.environment.userHome)
    .some((candidate) => existsSync(candidate));
  const socketFor = (siteId: string) => siteMysqlSocket(
    context.environment.userDataPath,
    siteId,
  );

  LocalMain.addIpcAsyncListener(CHANNELS.availability, (siteId: unknown) => {
    if (typeof siteId !== 'string') {
      return false;
    }

    try {
      return process.platform === 'darwin'
        && hasTablePro()
        && existsSync(socketFor(siteId));
    } catch {
      return false;
    }
  });

  LocalMain.addIpcAsyncListener(CHANNELS.open, async (payload: unknown) => {
    if (process.platform !== 'darwin') {
      throw new Error('TablePro integration is available only on macOS.');
    }
    if (!hasTablePro()) {
      throw new Error('TablePro is not installed in a supported location.');
    }

    const request = parseOpenDatabaseRequest(payload);
    const socket = socketFor(request.siteId);
    if (!existsSync(socket)) {
      throw new Error('The selected Local site is not running.');
    }

    const port = await bridges.acquire(request.siteId, socket);
    const databaseUrl = tableProDatabaseUrl(request, port);
    await runFile('/usr/bin/open', ['-b', tableProBundleId(), databaseUrl]);

    return true;
  });

  context.hooks.addAction('siteStopped', (site: { id?: string } | undefined) => {
    if (site?.id) {
      void bridges.release(site.id);
    }
  });

  context.process.once('exit', () => {
    void bridges.releaseAll();
  });
}
