import 'dotenv/config';

const required = ['DATABASE_URL', 'SESSION_SECRET', 'PUBLIC_BASE_URL'];
for (const name of required) {
  if (!process.env[name]) throw new Error(`Missing required environment variable: ${name}`);
}
if (process.env.SESSION_SECRET.length < 32) {
  throw new Error('SESSION_SECRET must contain at least 32 characters.');
}

export const config = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  publicBaseUrl: new URL(process.env.PUBLIC_BASE_URL).origin,
  databaseUrl: process.env.DATABASE_URL,
  sessionSecret: process.env.SESSION_SECRET,
  whatsappNumber: (process.env.WHATSAPP_NUMBER || '').replace(/\D/g, ''),
  trustProxy: process.env.TRUST_PROXY === '1',
  dataRetentionDays: Number(process.env.DATA_RETENTION_DAYS || 0),
});

if (config.nodeEnv === 'production' && !config.publicBaseUrl.startsWith('https://')) {
  throw new Error('PUBLIC_BASE_URL must use HTTPS in production.');
}
if (config.nodeEnv === 'production' && (!Number.isInteger(config.dataRetentionDays) || config.dataRetentionDays < 1 || config.dataRetentionDays > 3650)) {
  throw new Error('Set DATA_RETENTION_DAYS (1–3650) before starting in production.');
}
