const pool = require("./db");

const initDb = async () => {
  const client = await pool.connect();

  try {
    console.log("🔧 Initializing database...");

    await client.query("BEGIN");

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("  ✔ users table ready");

    // Categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(50) NOT NULL,
        color VARCHAR(50) DEFAULT 'bg-primary',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("  ✔ categories table ready");

    // Todos table
    await client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        text TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("  ✔ todos table ready");

    // User settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        notifications BOOLEAN DEFAULT TRUE,
        dark_mode BOOLEAN DEFAULT FALSE,
        sounds BOOLEAN DEFAULT TRUE,
        week_starts_monday BOOLEAN DEFAULT TRUE,
        language VARCHAR(20) DEFAULT 'en',
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("  ✔ user_settings table ready");

    // Achievements definitions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(10) NOT NULL,
        condition_key VARCHAR(50) NOT NULL
      );
    `);
    console.log("  ✔ achievements table ready");

    // User achievements (unlocked status) table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
        unlocked_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, achievement_id)
      );
    `);
    console.log("  ✔ user_achievements table ready");

    // Seed achievements if table is empty
    const { rows } = await client.query("SELECT COUNT(*) FROM achievements");
    if (parseInt(rows[0].count) === 0) {
      await client.query(`
        INSERT INTO achievements (name, description, icon, condition_key) VALUES
          ('Early Bird',     'Completed 10 tasks before 9 AM',  '🌅', 'early_bird'),
          ('Streak Master',  'Maintained a 7-day streak',        '🔥', 'streak_7'),
          ('Perfectionist',  'Completed 100 tasks',              '✨', 'tasks_100'),
          ('Goal Getter',    'Achieved 10 weekly goals',         '🎯', 'goals_10'),
          ('Night Owl',      'Complete tasks after midnight',    '🦉', 'night_owl'),
          ('Centurion',      'Complete 1000 tasks',              '👑', 'tasks_1000');
      `);
      console.log("  ✔ achievements seeded");
    }

    await client.query("COMMIT");
    console.log("\n🎉 Database initialized successfully!");

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Database initialization failed:", err);
    throw err;
  } finally {
    client.release();
    pool.end();
  }
};

initDb();
