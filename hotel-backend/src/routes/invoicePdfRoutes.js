const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const { getPool } = require("../../config/db");

// fetch invoice data
async function fetchInvoice(bookingId, userId) {
  const pool = getPool();

  const [rows] = await pool.query(
    `SELECT 
      b.*, c.first_name, c.last_name, c.email,
      r.room_number, rt.type_name, rt.base_price
    FROM booking b
    JOIN customer c ON b.customer_id = c.customer_id
    JOIN room r ON b.room_id = r.room_id
    JOIN room_type rt ON r.type_id = rt.type_id
    WHERE b.booking_id = ? AND b.customer_id = ?`,
    [bookingId, userId]
  );

  return rows[0];
}

router.get("/:id/pdf", async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const bookingId = req.params.id;
    const userId = req.user.id;

    const data = await fetchInvoice(bookingId, userId);
    if (!data) return res.status(404).json({ message: "Invoice not found" });

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${bookingId}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text("FLASHBOY HOTEL", { underline: false });
    doc.moveDown();

    doc.fontSize(12)
      .text(`Invoice #: ${data.booking_id}`)
      .text(`Guest: ${data.first_name} ${data.last_name}`)
      .text(`Email: ${data.email}`)
      .moveDown();

    doc.text(`Room: ${data.type_name} (#${data.room_number})`);
    doc.text(`Check-in: ${data.check_in}`);
    doc.text(`Check-out: ${data.check_out}`);
    doc.moveDown();

    doc.fontSize(14).text("Total Amount:", { continued: true });
    doc.text(` PKR ${data.total_price}`, { align: "right" });

    doc.moveDown();

    doc.fontSize(10).text("* Auto generated invoice.");

    doc.end();
  } catch (err) {
    console.error("PDF error:", err);
    return res.status(500).json({ message: "Failed to generate PDF" });
  }
});

module.exports = router;
