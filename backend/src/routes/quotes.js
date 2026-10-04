import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { createPublicId } from '../middleware/security.js';
import { asyncRoute, validateBody } from '../middleware/validation.js';

const router = Router();
const quoteSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().regex(/^[+\d() .-]{10,24}$/),
  origin: z.string().trim().min(2).max(160),
  destination: z.string().trim().min(2).max(160),
  service: z.enum(['Transporte Rodoviário', 'Coleta e Entrega', 'Operações Personalizadas', 'Mudanças Residenciais / Comerciais']),
  cargo: z.string().trim().max(180).default(''),
  notes: z.string().trim().max(1200).default(''),
  consent: z.literal(true),
  website: z.string().max(500).optional().default(''),
});

router.post('/', validateBody(quoteSchema), asyncRoute(async (req, res) => {
  const { name, phone, origin, destination, service, cargo, notes, website } = req.validatedBody;
  if (website) return res.status(201).json({ received: true });
  const publicId = createPublicId('COT');
  const result = await pool.query(
    `INSERT INTO quote_requests (public_id, name, phone, origin, destination, service, cargo, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING public_id, created_at`,
    [publicId, name, phone, origin, destination, service, cargo, notes],
  );
  res.status(201).json({ received: true, reference: result.rows[0].public_id, createdAt: result.rows[0].created_at });
}));

export default router;
