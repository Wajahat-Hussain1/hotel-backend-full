const cron = require("node-cron");
const { getPool } = require("../../config/db");

cron.schedule("*/5 * * * *", async () => {
  try {
    const pool = getPool();

    // cancel pending bookings older than 1 hour
    const [result] = await pool.query(`
      UPDATE booking
      SET booking_status = 'cancelled'
      WHERE booking_status = 'pending'
        AND created_at < (NOW() - INTERVAL 1 HOUR)
    `);

    if (result.affectedRows > 0) {
      console.log("⏱ Auto-cancelled bookings:", result.affectedRows);
    }
  } catch (err) {
    console.error("Auto-cancel cron error:", err);
  }
});
