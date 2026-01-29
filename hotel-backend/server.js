require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initDB } = require('./config/db');
const errorMiddleware = require('./src/middlewares/errorMiddleware');

const app = express();


const allowedOrigins = [
  'http://localhost:3000', // my local frontend during development
  'https://your-frontend-link.vercel.app' // i will replace this later with my actual Vercel URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(bodyParser.json());

// initialize DB pool
initDB();

// PDF + email routes
const auth = require("./src/middlewares/authMiddleware");
app.use("/api/invoice", auth, require("./src/routes/invoicePdfRoutes"));

// Other invoice routes
app.use("/api/invoice", require("./src/routes/invoiceRoutes"));

// Admin stats
app.use('/api/admin/stats', require('./src/routes/adminStatsRoutes'));

// Standard routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/customers', require('./src/routes/customerRoutes'));
app.use('/api/staff', require('./src/routes/staffRoutes'));
app.use('/api/rooms', require('./src/routes/roomRoutes'));
app.use('/api/room-types', require('./src/routes/roomTypeRoutes'));
app.use('/api/bookings', require('./src/routes/bookingRoutes'));
app.use('/api/services', require('./src/routes/serviceRoutes'));
app.use('/api/service-orders', require('./src/routes/serviceOrderRoutes'));
app.use('/api/payments', require('./src/routes/paymentRoutes'));
app.use('/api/feedback', require('./src/routes/feedbackRoutes'));

// static uploads
app.use('/uploads', express.static('uploads'));

// error handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

require("./src/cron/autoCancelBookings");