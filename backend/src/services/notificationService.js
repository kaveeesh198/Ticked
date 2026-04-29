const cron = require("node-cron");
const pool = require("../config/db");
const { sendDueSoonEmail } = require("./emailService");

// Runs every hour at :00
// Finds tasks due within the next 60 minutes for users with notifications ON
// Sends one email per user with all their due-soon tasks

const startNotificationCron = () => {
  cron.schedule("0 * * * *", async () => {
    console.log("🔔 Running due-soon notification check...");

    try {
      const { rows } = await pool.query(`
        SELECT
          t.id,
          t.text,
          t.due_date,
          u.id AS user_id,
          u.name AS user_name,
          u.email AS user_email
        FROM todos t
        JOIN users u ON u.id = t.user_id
        JOIN user_settings s ON s.user_id = u.id
        WHERE
          t.completed = FALSE
          AND t.due_date IS NOT NULL
          AND s.notifications = TRUE
          AND t.due_date > NOW()
          AND t.due_date <= NOW() + INTERVAL '60 minutes'
          AND t.notified = FALSE
      `);

      if (rows.length === 0) {
        console.log("   No due-soon tasks found.");
        return;
      }

      // Group tasks by user
      const byUser = rows.reduce((acc, row) => {
        if (!acc[row.user_id]) {
          acc[row.user_id] = {
            userId: row.user_id,
            userName: row.user_name,
            userEmail: row.user_email,
            tasks: [],
          };
        }
        acc[row.user_id].tasks.push({
          id: row.id,
          text: row.text,
          due_date: row.due_date,
        });
        return acc;
      }, {});

      // Send one email per user
      for (const user of Object.values(byUser)) {
        try {
          await sendDueSoonEmail({
            toEmail: user.userEmail,
            userName: user.userName,
            tasks: user.tasks,
          });

          // Mark tasks as notified so we don't email again
          const taskIds = user.tasks.map((t) => t.id);
          await pool.query(
            `UPDATE todos SET notified = TRUE WHERE id = ANY($1)`,
            [taskIds]
          );
        } catch (err) {
          console.error(`Failed to notify ${user.userEmail}:`, err.message);
        }
      }

      console.log(`   ✅ Notified ${Object.keys(byUser).length} user(s)`);
    } catch (err) {
      console.error("Cron job error:", err.message);
    }
  });

  console.log("⏰ Notification cron job started (runs every hour)");
};

module.exports = { startNotificationCron };