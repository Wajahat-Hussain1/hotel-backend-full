const cron = require("node-cron");
const { getPool } = require("../../config/db");

cron.schedule("*/5 * * * *", async () => {
  try {
    const pool = getPool();
    
    // Safety check: ensure pool is initialized
    if (!pool) {
      console.log("Cron skipped: Database pool not ready.");
      return;
    }

    // This now works because you added 'created_at' to TiDB
    const [result] = await pool.query(`
      UPDATE booking
      SET booking_status = 'cancelled'
      WHERE booking_status = 'pending'
        AND created_at < (NOW() - INTERVAL 1 HOUR)
    `);

    if (result.affectedRows > 0) {
      console.log(`⏱ [${new Date().toISOString()}] Auto-cancelled bookings:`, result.affectedRows);
    }
  } catch (err) {
    // This will now catch errors without crashing the whole server
    console.error("Auto-cancel cron error details:", err.message);
  }
});