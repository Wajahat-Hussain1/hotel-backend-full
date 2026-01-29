// const express = require("express");
// const router = express.Router();

// const auth = require("../middlewares/authMiddleware");
// const role = require("../middlewares/roleMiddleware");

// const {
//   listCustomers,
//   getCustomer,
//   createCustomer,
//   updateCustomer,
//   softDeleteCustomer
// } = require("../controllers/customerController");

// // GET all active customers
// router.get("/", auth, role(["admin", "manager"]), listCustomers);

// // Get one customer
// router.get("/:id", auth, role(["admin", "manager"]), getCustomer);

// // Add new customer
// router.post("/", auth, role(["admin"]), createCustomer);

// // Update customer
// router.put("/:id", auth, role(["admin"]), updateCustomer);

// // Soft delete (status = inactive)
// router.delete("/:id", auth, role(["admin"]), softDeleteCustomer);

// module.exports = router;

const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  getCustomerDetails,
  deleteCustomerPermanently
} = require("../controllers/customerController");


// ===============================
// CUSTOMER ROUTES (ADMIN / MANAGER)
// ===============================

// 1️⃣ Get ALL customers
router.get(
  "/",
  auth,
  role(["admin", "manager"]),
  listCustomers
);

// 2️⃣ Get SINGLE customer (basic info – for edit)
router.get(
  "/:id",
  auth,
  role(["admin", "manager"]),
  getCustomer
);

// 3️⃣ Get CUSTOMER DETAILS + BOOKINGS (VIEW PAGE)
router.get(
  "/:id/details",
  auth,
  role(["admin", "manager"]),
  getCustomerDetails
);

// 4️⃣ CREATE customer
router.post(
  "/",
  auth,
  role(["admin"]),
  createCustomer
);

// 5️⃣ UPDATE customer
router.put(
  "/:id",
  auth,
  role(["admin"]),
  updateCustomer
);

// 6️⃣ HARD DELETE customer (FULL WIPE)
router.delete(
  "/:id/permanent",
  auth,
  role(["admin"]),
  deleteCustomerPermanently
);

module.exports = router;

