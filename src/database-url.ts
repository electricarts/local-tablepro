import type { OpenDatabaseRequest } from './protocol';

const TABLEPRO_BUNDLE = 'com.TablePro';

function escaped(value: string): string {
  return encodeURIComponent(value);
}

export function tableProBundleId(): string {
  return TABLEPRO_BUNDLE;
}

export function tableProDatabaseUrl(request: OpenDatabaseRequest, port: number): string {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new RangeError('The bridge port is outside the TCP port range.');
  }

  const { credentials } = request;
  const secret = credentials.password ? `:${escaped(credentials.password)}` : '';
  const authority = `${escaped(credentials.user)}${secret}@127.0.0.1:${port}`;
  const options = new URLSearchParams({
    env: 'local',
    name: request.siteName,
    safeModeLevel: '0',
    sslmode: 'require',
  });

  return `mysql://${authority}/${escaped(credentials.database)}?${options.toString()}`;
}
