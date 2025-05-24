import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  const { id, password } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    await pool.query('UPDATE orders SET picked_up = TRUE WHERE id = $1', [id]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
}
