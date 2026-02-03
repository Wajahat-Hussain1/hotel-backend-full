require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initDB } = require('./config/db');
const errorMiddleware = require('./src/middlewares/errorMiddleware');

const app = express();

// --- CORS CONFIGURATION ---
//const allowedOrigins = [
//  'http://localhost:3000', 
//  'hotel-management-reservation-beta.vercel.app',
//  'hotel-management-reservation-beta.vercel.app'
//];

//app.use(cors({
//  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
//    if (!origin) return callback(null, true);

    // Check if origin is in our list OR is a Vercel preview URL from your project
//    const isAllowed = allowedOrigins.indexOf(origin) !== -1;
//    const isVercelPreview = origin.endsWith(".vercel.app") && origin.includes("wajahat-hussains-projects");

//    if (isAllowed || isVercelPreview) {
//      return callback(null, true);
//    } else {
      // This log will appear in Render so you can see exactly what URL to add next time
//      console.log("CORS blocked origin:", origin);
//      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//      return callback(new Error(msg), false);
//    }
//  },
//  credentials: true
//}));

// --- UPDATED CORS CONFIGURATION ---
const allowedOrigins = [
  'http://localhost:3000', 
  'https://hotel-management-reservation.vercel.app', // Your main production link
  'https://hotel-management-reservation-beta.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // 1. Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // 2. Check if the origin is explicitly in our allowed list
    const isAllowed = allowedOrigins.includes(origin);

    // 3. Check if it's ANY Vercel preview link from your project
    // This looks for anything ending in .vercel.app
    const isVercelPreview = origin.endsWith(".vercel.app");

    if (isAllowed || isVercelPreview) {
      return callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      return callback(new Error('CORS policy blockage'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Initialize DB pool
initDB();

// --- ROUTES ---

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

// Static uploads
app.use('/uploads', express.static('uploads'));

// Error handler middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Run Cron Jobs
require("./src/cron/autoCancelBookings");