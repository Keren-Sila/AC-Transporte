import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { config } from './config.js';
import { pool } from './db/pool.js';
import quotesRouter from './routes/quotes.js';
import adminRouter from './routes/admin.js';
import trackingRouter from './routes/tracking.js';
import { requireSameOrigin } from './middleware/security.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '../..');
const PgSessionStore = connectPgSimple(session);
const app = express();
app.disable('x-powered-by');
if (config.trustProxy) app.set('trust proxy', 1);
app.locals.publicOrigin = config.publicBaseUrl;
app.locals.production = config.nodeEnv === 'production';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      imgSrc: ["'self'", 'data:', 'https://images.unsplash.com'],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      upgradeInsecureRequests: config.nodeEnv === 'production' ? [] : null,
    },
  },
  hsts: config.nodeEnv === 'production' ? undefined : false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
app.use(express.json({ limit: '16kb', strict: true }));
app.use(session({
  name: 'ac.sid',
  store: new PgSessionStore({ pool, tableName: 'user_sessions', createTableIfMissing: true }),
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 8,
    path: '/',
  },
}));

const publicApiLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false });
const quoteLimit = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false });
const loginLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-8', legacyHeaders: false, skipSuccessfulRequests: true });

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/quotes', quoteLimit, requireSameOrigin, quotesRouter);
app.use('/api/admin', publicApiLimit, (req, res, next) => req.path === '/login' ? loginLimit(req, res, next) : next(), adminRouter);
app.use('/api/tracking', publicApiLimit, trackingRouter);
app.use('/api', (_req, res) => res.status(404).json({ error: 'Rota da API não encontrada.' }));

app.use((req, res, next) => {
  if (/^\/(?:backend|node_modules|\.git)(?:\/|$)/i.test(req.path)) return res.status(404).end();
  next();
});
app.use(express.static(projectRoot, { dotfiles: 'deny', index: false, fallthrough: true, maxAge: config.nodeEnv === 'production' ? '1h' : 0 }));
app.get('/', (_req, res) => res.sendFile(path.join(projectRoot, 'index.html')));
app.use((_req, res) => res.status(404).sendFile(path.join(projectRoot, 'pages', '404.html')));

app.use((error, _req, res, _next) => {
  console.error('Request failed:', error.message);
  if (res.headersSent) return;
  res.status(error.status === 413 ? 413 : 500).json({ error: error.status === 413 ? 'A solicitação excede o limite permitido.' : 'Não foi possível concluir a solicitação.' });
});

export default app;
