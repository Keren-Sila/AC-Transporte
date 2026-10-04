import { Router } from 'express';
import { randomBytes } from 'node:crypto';
import argon2 from 'argon2';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { asyncRoute, validateBody } from '../middleware/validation.js';
import { requireAdmin, requireCsrf, requireSameOrigin } from '../middleware/security.js';

const router = Router();
const loginSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(200),
});
const quoteStatusSchema = z.object({ status: z.enum(['new', 'contacted', 'quoted', 'closed']) });
const fakeHash = '$argon2id$v=19$m=19456,t=2,p=1$Y3VydmF0dXJlZC1mb3ItYWMtdHJhbnNwb3J0ZQ$OHfUKHAabReXmSZFUze2oGhfevyYvGLoB2PvziSS7gs';

router.get('/session', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ authenticated: Boolean(req.session.adminId), csrfToken: req.session.adminId ? req.session.csrfToken : null });
});

router.post('/login', requireSameOrigin, validateBody(loginSchema), asyncRoute(async (req, res) => {
  const { email, password } = req.validatedBody;
  const result = await pool.query('SELECT id, email, password_hash FROM admin_users WHERE email=$1 AND disabled_at IS NULL', [email]);
  const user = result.rows[0];
  const passwordMatches = await argon2.verify(user?.password_hash || fakeHash, password).catch(() => false);
  if (!user || !passwordMatches) return res.status(401).json({ error: 'E-mail ou senha incorretos.' });

  await new Promise((resolve, reject) => req.session.regenerate((error) => error ? reject(error) : resolve()));
  req.session.adminId = user.id;
  req.session.adminEmail = user.email;
  req.session.csrfToken = randomBytes(32).toString('hex');
  await pool.query('UPDATE admin_users SET last_login_at=now() WHERE id=$1', [user.id]);
  res.set('Cache-Control', 'no-store');
  res.json({ authenticated: true, email: user.email, csrfToken: req.session.csrfToken });
}));

router.post('/logout', requireSameOrigin, requireAdmin, requireCsrf, (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie('ac.sid', { httpOnly: true, sameSite: 'strict', secure: req.app.locals.production, path: '/' });
    res.status(204).end();
  });
});

router.get('/quotes', requireAdmin, asyncRoute(async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
  const result = await pool.query(
    `SELECT id, public_id AS reference, name, company, phone, email, origin, destination, service, cargo, notes, status, created_at
       FROM quote_requests ORDER BY created_at DESC LIMIT $1`, [limit],
  );
  res.set('Cache-Control', 'no-store');
  res.json({ quotes: result.rows });
}));

router.patch('/quotes/:id/status', requireAdmin, requireCsrf, validateBody(quoteStatusSchema), asyncRoute(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ error: 'Identificador inválido.' });
  const result = await pool.query(
    'UPDATE quote_requests SET status=$1, updated_at=now() WHERE id=$2 RETURNING id,status',
    [req.validatedBody.status, id],
  );
  if (!result.rowCount) return res.status(404).json({ error: 'Cotação não encontrada.' });
  res.json(result.rows[0]);
}));

router.get('/shipments', requireAdmin, asyncRoute(async (_req, res) => {
  const result = await pool.query(
    `SELECT tracking_code AS "trackingCode", reference, origin, destination, status, created_at
       FROM shipments ORDER BY created_at DESC LIMIT 100`,
  );
  res.set('Cache-Control', 'no-store');
  res.json({ shipments: result.rows });
}));

export default router;
