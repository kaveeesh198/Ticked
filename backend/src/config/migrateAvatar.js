const pool = require("./db");

const migrate = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      ALTER TABLE users
      ALTER COLUMN avatar_url TYPE TEXT;
    `);
    console.log("✅ avatar_url column updated to TEXT — base64 images supported!");
  } catch (err) {
    console.error("Migration failed:", err.message);
  } finally {
    client.release();
    pool.end();
  }
};

migrate();