import app from './app.js';
import { config } from './config.js';
import { pool } from './db/pool.js';

const server = app.listen(config.port, () => {
  console.log(`AC Transporte server listening on port ${config.port}`);
});

if (config.dataRetentionDays > 0) {
  const cleanExpiredQuotes = async () => {
    try {
      const result = await pool.query(
        `DELETE FROM quote_requests WHERE created_at < now() - ($1 * interval '1 day')`,
        [config.dataRetentionDays],
      );
      if (result.rowCount) console.log(`Expired quote records removed: ${result.rowCount}`);
    } catch (error) {
      console.error('Retention cleanup failed:', error.message);
    }
  };
  cleanExpiredQuotes();
  setInterval(cleanExpiredQuotes, 24 * 60 * 60 * 1000).unref();
}

async function shutdown(signal) {
  console.log(`${signal} received; closing server.`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
