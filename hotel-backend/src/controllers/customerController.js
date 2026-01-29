


// const { getPool } = require("../../config/db");

// // Format function
// const safe = (v) => (v === null || v === undefined ? null : v);

// // GET ALL active customers
// async function listCustomers(req, res) {
//   try {
//     const pool = getPool();

//     const [rows] = await pool.query(`
//       SELECT 
//         customer_id,
//         first_name,
//         last_name,
//         email,
//         created_at,
//         status
//       FROM customer
//       WHERE status = 'active'
//       ORDER BY customer_id DESC
//     `);

//     return res.json({ success: true, data: rows });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: "Failed to load customers" });
//   }
// }

// // GET ONE CUSTOMER
// async function getCustomer(req, res) {
//   try {
//     const pool = getPool();
//     const id = req.params.id;

//     const [[customer]] = await pool.query(
//       `SELECT * FROM customer WHERE customer_id = ?`,
//       [id]
//     );

//     if (!customer)
//       return res.status(404).json({ success: false, message: "Customer not found" });

//     return res.json({ success: true, data: customer });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: "Failed to get customer" });
//   }
// }

// // CREATE CUSTOMER
// async function createCustomer(req, res) {
//   try {
//     const { first_name, last_name, email, password } = req.body;

//     const pool = getPool();

//     const [result] = await pool.query(
//       `INSERT INTO customer (first_name, last_name, email, password)
//        VALUES (?, ?, ?, ?)`,
//       [first_name, last_name, email, password]
//     );

//     return res.json({ success: true, message: "Customer added", id: result.insertId });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: "Add failed" });
//   }
// }

// // UPDATE CUSTOMER
// async function updateCustomer(req, res) {
//   try {
//     const id = req.params.id;
//     const data = req.body;
//     const fields = [];
//     const values = [];

//     for (let key in data) {
//       fields.push(`${key} = ?`);
//       values.push(safe(data[key]));
//     }

//     values.push(id);

//     const pool = getPool();
//     await pool.query(
//       `UPDATE customer SET ${fields.join(", ")} WHERE customer_id = ?`,
//       values
//     );

//     return res.json({ success: true, message: "Customer updated" });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: "Update failed" });
//   }
// }

// // SOFT DELETE CUSTOMER
// async function softDeleteCustomer(req, res) {
//   try {
//     const id = req.params.id;
//     const pool = getPool();

//     const [result] = await pool.query(
//       `UPDATE customer SET status = 'inactive' WHERE customer_id = ?`,
//       [id]
//     );

//     return res.json({ success: true, message: "Customer marked as inactive" });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: "Delete failed" });
//   }
// }

// async function getCustomer(req, res) {
//   try {
//     const id = req.params.id;

//     const [rows] = await getPool().query(
//       "SELECT * FROM customer WHERE customer_id = ?",
//       [id]
//     );

//     if (rows.length === 0)
//       return res.status(404).json({ success: false, message: "Customer not found" });

//     return res.json({ success: true, data: rows[0] });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: "Error fetching customer" });
//   }
// }


// module.exports = {
//   listCustomers,
//   getCustomer,
//   createCustomer,
//   updateCustomer,
//   softDeleteCustomer
// };

const { getPool } = require("../../config/db");

// ===============================
// GET ALL CUSTOMERS
// ===============================
async function listCustomers(req, res) {
  try {
    const pool = getPool();

    const [rows] = await pool.query(`
      SELECT 
        customer_id,
        first_name,
        last_name,
        email,
        created_at
      FROM customer
      ORDER BY customer_id DESC
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to load customers" });
  }
}

// ===============================
// GET SINGLE CUSTOMER (EDIT)
// ===============================
async function getCustomer(req, res) {
  try {
    const id = req.params.id;
    const pool = getPool();

    const [[customer]] = await pool.query(
      `SELECT customer_id, first_name, last_name, email, created_at
       FROM customer WHERE customer_id = ?`,
      [id]
    );

    if (!customer)
      return res.status(404).json({ success: false, message: "Customer not found" });

    res.json({ success: true, data: customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get customer" });
  }
}

// ===============================
// CUSTOMER DETAILS + BOOKINGS
// ===============================
async function getCustomerDetails(req, res) {
  try {
    const id = req.params.id;
    const pool = getPool();

    const [[customer]] = await pool.query(
      `SELECT customer_id, first_name, last_name, email, created_at
       FROM customer WHERE customer_id = ?`,
      [id]
    );

    if (!customer)
      return res.status(404).json({ success: false, message: "Customer not found" });

    const [bookings] = await pool.query(`
      SELECT 
        b.booking_id,
        b.check_in,
        b.check_out,
        b.total_price,
        b.booking_status,
        r.room_number,
        rt.type_name
      FROM booking b
      JOIN room r ON b.room_id = r.room_id
      JOIN room_type rt ON r.type_id = rt.type_id
      WHERE b.customer_id = ?
      ORDER BY b.booking_id DESC
    `, [id]);

    res.json({
      success: true,
      data: {
        customer,
        bookings
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to load details" });
  }
}

// ===============================
// CREATE CUSTOMER
// ===============================
async function createCustomer(req, res) {
  try {
    const { first_name, last_name, email, password } = req.body;
    const pool = getPool();

    const [result] = await pool.query(
      `INSERT INTO customer (first_name, last_name, email, password)
       VALUES (?, ?, ?, ?)`,
      [first_name, last_name, email, password]
    );

    res.json({
      success: true,
      message: "Customer created",
      id: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Create failed" });
  }
}

// ===============================
// UPDATE CUSTOMER
// ===============================
async function updateCustomer(req, res) {
  try {
    const id = req.params.id;
    const data = req.body;

    const fields = [];
    const values = [];

    for (let key in data) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }

    values.push(id);

    const pool = getPool();
    await pool.query(
      `UPDATE customer SET ${fields.join(", ")} WHERE customer_id = ?`,
      values
    );

    res.json({ success: true, message: "Customer updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
}

// ===============================
// HARD DELETE CUSTOMER (FULL WIPE)
// ===============================
async function deleteCustomerPermanently(req, res) {
  const id = req.params.id;
  const pool = getPool();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [bookings] = await conn.query(
      "SELECT booking_id FROM booking WHERE customer_id = ?",
      [id]
    );

    const bookingIds = bookings.map(b => b.booking_id);

    if (bookingIds.length > 0) {
      await conn.query("DELETE FROM feedback WHERE booking_id IN (?)", [bookingIds]);
      await conn.query("DELETE FROM service_order WHERE booking_id IN (?)", [bookingIds]);
      await conn.query("DELETE FROM payment WHERE booking_id IN (?)", [bookingIds]);
      await conn.query("DELETE FROM booking WHERE customer_id = ?", [id]);
    }

    await conn.query("DELETE FROM customer WHERE customer_id = ?", [id]);

    await conn.commit();
    res.json({ success: true, message: "Customer permanently deleted" });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ success: false, message: "Delete failed" });
  } finally {
    conn.release();
  }
}

// ===============================
// EXPORTS
// ===============================
module.exports = {
  listCustomers,
  getCustomer,
  getCustomerDetails,
  createCustomer,
  updateCustomer,
  deleteCustomerPermanently
};
