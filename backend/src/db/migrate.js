import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

try {
  const sql = await readFile(fileURLToPath(new URL('../../migrations/001_initial.sql', import.meta.url)), 'utf8');
  await pool.query(sql);
  console.log('Database schema is up to date.');
} catch (error) {
  console.error('Database migration failed:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
