import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  const { password, picked_up } = req.method === 'POST' ? req.body : req.query;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    let query = 'SELECT * FROM orders';
    let params = [];
    if (picked_up === true || picked_up === false) {
      query += ' WHERE picked_up = $1';
      params.push(picked_up);
    }
    query += ' ORDER BY id DESC';
    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
