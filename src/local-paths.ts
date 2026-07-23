import path from 'node:path';

const SAFE_SITE_ID = /^[A-Za-z0-9_-]+$/;

export function siteMysqlSocket(localDataDirectory: string, siteId: string): string {
  if (!localDataDirectory) {
    throw new TypeError('Local did not expose its data directory.');
  }
  if (!SAFE_SITE_ID.test(siteId)) {
    throw new TypeError('The Local site ID contains unsupported characters.');
  }

  return path.resolve(localDataDirectory, 'run', siteId, 'mysql', 'mysqld.sock');
}

export function tableProInstallations(userHome: string): string[] {
  const locations = [
    '/Applications/TablePro.app',
    '/Applications/Setapp/TablePro.app',
  ];

  if (userHome) {
    locations.push(path.resolve(userHome, 'Applications', 'TablePro.app'));
  }

  return locations;
}
