import argon2 from 'argon2';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { pool } from './db/pool.js';

const rl = createInterface({ input: stdin, output: stdout });
try {
  const email = (await rl.question('Admin e-mail: ')).trim().toLowerCase();
  const password = await rl.question('Senha (mínimo 12 caracteres): ');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 12 || password.length > 200) {
    throw new Error('Informe um e-mail válido e uma senha entre 12 e 200 caracteres.');
  }
  const passwordHash = await argon2.hash(password, { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });
  await pool.query(
    `INSERT INTO admin_users (email,password_hash) VALUES ($1,$2)
     ON CONFLICT (email) DO UPDATE SET password_hash=EXCLUDED.password_hash, disabled_at=NULL`,
    [email, passwordHash],
  );
  console.log(`Admin ${email} cadastrado/atualizado.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  rl.close();
  await pool.end();
}
