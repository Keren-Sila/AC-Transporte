import { randomBytes, timingSafeEqual } from 'node:crypto';

export function requireSameOrigin(req, res, next) {
  const origin = req.get('origin');
  if (origin !== req.app.locals.publicOrigin) {
    return res.status(403).json({ error: 'Origem da solicitação inválida.' });
  }
  next();
}

export function issueCsrfToken(req, res) {
  req.session.csrfToken ||= randomBytes(32).toString('hex');
  res.set('Cache-Control', 'no-store');
  res.json({ authenticated: Boolean(req.session.adminId), csrfToken: req.session.csrfToken });
}

export function requireAdmin(req, res, next) {
  if (!req.session.adminId) return res.status(401).json({ error: 'Sessão encerrada. Entre novamente.' });
  next();
}

export function requireCsrf(req, res, next) {
  const received = req.get('x-csrf-token') || '';
  const expected = req.session.csrfToken || '';
  const sameLength = Buffer.byteLength(received) === Buffer.byteLength(expected);
  const valid = sameLength && expected.length > 0 && timingSafeEqual(Buffer.from(received), Buffer.from(expected));
  if (!valid) return res.status(403).json({ error: 'Token de segurança inválido. Atualize a página.' });
  next();
}

export function createPublicId(prefix) {
  return `${prefix}-${randomBytes(6).toString('hex').toUpperCase()}`;
}
