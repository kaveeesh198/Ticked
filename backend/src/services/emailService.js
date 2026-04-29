const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendDueSoonEmail = async ({ toEmail, userName, tasks }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("⚠️  Email not configured — skipping notification");
    return;
  }

  const taskList = tasks
    .map((t) => {
      const due = new Date(t.due_date);
      const timeStr = due.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return `<li style="margin-bottom:8px;">
        <strong>${t.text}</strong><br/>
        <span style="color:#b47517;font-size:13px;">Due: ${timeStr}</span>
      </li>`;
    })
    .join("");

  const html = `
    <div style="font-family:'Georgia',serif;max-width:520px;margin:0 auto;background:#fffdf7;border:1px solid #f0ddb0;border-radius:12px;overflow:hidden;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#b47517,#e8a020);padding:28px 32px;">
        <h1 style="margin:0;color:#fff;font-size:26px;letter-spacing:-0.5px;">✅ Ticked</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Task Reminder</p>
      </div>

      <!-- Body -->
      <div style="padding:28px 32px;">
        <h2 style="color:#3d2b00;font-size:20px;margin:0 0 8px;">Hey ${userName}! ⏰</h2>
        <p style="color:#7a5c1e;font-size:15px;margin:0 0 20px;">
          You have ${tasks.length} task${tasks.length > 1 ? "s" : ""} due within the next hour. Don't let them slip!
        </p>

        <ul style="color:#3d2b00;font-size:15px;padding-left:20px;margin:0 0 24px;">
          ${taskList}
        </ul>

        <a href="${process.env.CLIENT_URL || "https://ticked.vercel.app"}"
           style="display:inline-block;background:#b47517;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">
          Open Ticked →
        </a>
      </div>

      <!-- Footer -->
      <div style="padding:16px 32px;border-top:1px solid #f0ddb0;background:#fdf8ee;">
        <p style="margin:0;color:#b89a50;font-size:12px;">
          You're receiving this because push notifications are enabled in your Ticked settings.
          <br/>To stop, go to Settings → Preferences → Push Notifications.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Ticked" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `⏰ ${tasks.length} task${tasks.length > 1 ? "s" : ""} due soon — Ticked`,
    html,
  });

  console.log(`📧 Due-soon email sent to ${toEmail}`);
};

module.exports = { sendDueSoonEmail };