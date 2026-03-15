const CONNECTION_ERROR_CODES = new Set([
  'ECONNREFUSED',
  'ENOTFOUND',
  'ETIMEDOUT',
  'PROTOCOL_CONNECTION_LOST',
  'ER_ACCESS_DENIED_ERROR',
  'ER_BAD_DB_ERROR',
]);

export function isConnectionError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return false;
  }

  const code = String((error as { code?: unknown }).code ?? '');
  return CONNECTION_ERROR_CODES.has(code);
}

export function toDateString(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }

  if (typeof value === 'string') {
    return value.length >= 10 ? value.slice(0, 10) : value;
  }

  return null;
}