const pool = require("./db");

const migrate = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      ALTER TABLE todos
      ADD COLUMN IF NOT EXISTS due_date TIMESTAMP,
      ADD COLUMN IF NOT EXISTS notified BOOLEAN DEFAULT FALSE;
    `);
    console.log("✅ due_date and notified columns added to todos!");
  } catch (err) {
    console.error("Migration failed:", err.message);
  } finally {
    client.release();
    pool.end();
  }
};

migrate();