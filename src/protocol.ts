export const CHANNELS = Object.freeze({
  availability: 'local-tablepro-v2:availability',
  open: 'local-tablepro-v2:open',
});

export interface DatabaseCredentials {
  database: string;
  password: string;
  user: string;
}

export interface OpenDatabaseRequest {
  credentials: DatabaseCredentials;
  siteId: string;
  siteName: string;
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError(`${field} must be a non-empty string.`);
  }

  return value;
}

export function parseOpenDatabaseRequest(value: unknown): OpenDatabaseRequest {
  if (!value || typeof value !== 'object') {
    throw new TypeError('The database request must be an object.');
  }

  const candidate = value as Record<string, unknown>;
  const credentials = candidate.credentials;
  if (!credentials || typeof credentials !== 'object') {
    throw new TypeError('The database credentials must be an object.');
  }

  const fields = credentials as Record<string, unknown>;
  return {
    credentials: {
      database: requiredString(fields.database, 'database'),
      password: typeof fields.password === 'string' ? fields.password : '',
      user: requiredString(fields.user, 'user'),
    },
    siteId: requiredString(candidate.siteId, 'siteId'),
    siteName: requiredString(candidate.siteName, 'siteName'),
  };
}
