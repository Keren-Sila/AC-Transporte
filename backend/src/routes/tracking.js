import { Router } from 'express';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { asyncRoute, validateBody } from '../middleware/validation.js';
import { requireAdmin, requireCsrf } from '../middleware/security.js';

const router = Router();
const statuses = ['created', 'collected', 'in_transit', 'out_for_delivery', 'delivered', 'delayed', 'cancelled'];
const eventSchema = z.object({
  status: z.enum(statuses),
  location: z.string().trim().max(80).regex(/^[\p{L}\p{M}\s.,/-]*$/u, 'Informe somente cidade/região.').default(''),
  description: z.string().trim().min(3).max(300),
});
const shipmentSchema = z.object({
  reference: z.string().trim().min(2).max(100),
  origin: z.string().trim().min(2).max(80).regex(/^[\p{L}\p{M}\s.,/-]+$/u),
  destination: z.string().trim().min(2).max(80).regex(/^[\p{L}\p{M}\s.,/-]+$/u),
  quoteRequestId: z.number().int().positive().optional(),
  description: z.string().trim().min(3).max(300).default('Embarque cadastrado.'),
});

router.get('/:code', asyncRoute(async (req, res) => {
  const code = String(req.params.code || '').toUpperCase();
  if (!/^AC-[A-F0-9]{32}$/.test(code)) return res.status(404).json({ error: 'Embarque não encontrado.' });
  const result = await pool.query(
    `SELECT s.tracking_code, s.origin, s.destination, s.status, s.updated_at,
            COALESCE(json_agg(json_build_object('status', e.status, 'location', e.location,
              'at', e.event_time) ORDER BY e.event_time DESC)
              FILTER (WHERE e.id IS NOT NULL), '[]'::json) AS events
       FROM shipments s LEFT JOIN tracking_events e ON e.shipment_id = s.id
      WHERE s.tracking_code = $1 GROUP BY s.id`, [code],
  );
  if (!result.rowCount) return res.status(404).json({ error: 'Embarque não encontrado.' });
  res.set('Cache-Control', 'no-store');
  res.json(result.rows[0]);
}));

router.post('/', requireAdmin, requireCsrf, validateBody(shipmentSchema), asyncRoute(async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const code = `AC-${randomBytes(16).toString('hex').toUpperCase()}`;
    const { reference, origin, destination, quoteRequestId, description } = req.validatedBody;
    const inserted = await client.query(
      `INSERT INTO shipments (tracking_code, reference, origin, destination, quote_request_id)
       VALUES ($1,$2,$3,$4,$5) RETURNING id, tracking_code, created_at`,
      [code, reference, origin, destination, quoteRequestId || null],
    );
    await client.query(
      `INSERT INTO tracking_events (shipment_id, status, description, created_by) VALUES ($1,'created',$2,$3)`,
      [inserted.rows[0].id, description, req.session.adminId],
    );
    await client.query('COMMIT');
    res.status(201).json({ trackingCode: code, createdAt: inserted.rows[0].created_at });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}));

router.post('/:code/events', requireAdmin, requireCsrf, validateBody(eventSchema), asyncRoute(async (req, res) => {
  const code = String(req.params.code || '').toUpperCase();
  if (!/^AC-[A-F0-9]{32}$/.test(code)) return res.status(404).json({ error: 'Embarque não encontrado.' });
  const { status, location, description } = req.validatedBody;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const updated = await client.query(
      'UPDATE shipments SET status=$1, updated_at=now() WHERE tracking_code=$2 RETURNING id', [status, code],
    );
    if (!updated.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Embarque não encontrado.' });
    }
    await client.query(
      `INSERT INTO tracking_events (shipment_id,status,location,description,created_by)
       VALUES ($1,$2,$3,$4,$5)`,
      [updated.rows[0].id, status, location, description, req.session.adminId],
    );
    await client.query('COMMIT');
    res.status(201).json({ updated: true });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}));

export default router;
