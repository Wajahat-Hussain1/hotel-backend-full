const { 
  findCustomerByEmail, 
  createNewCustomer 
} = require("../models/customerModel");

const { findStaffByEmail } = require("../models/staffModel");
const { findByUsername } = require("../models/adminModel");

const { comparePassword, hashPassword } = require("../utils/bcryptHelper");
const generateToken = require("../utils/generateToken");
const { success, error } = require("../utils/responseHelper");


// ============================================================
// LOGIN (ADMIN + STAFF + CUSTOMER)
// ============================================================
async function login(req, res) {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password)
      return error(res, "Email/Username and password required", 400);


    // 1️⃣ ADMIN LOGIN
    const admin = await findByUsername(emailOrUsername).catch(() => null);

    if (admin) {
      const valid = await comparePassword(password, admin.password);
      if (!valid) return error(res, "Invalid credentials", 401);

      const token = generateToken({
        id: admin.admin_id,
        role: "admin",
        username: admin.username
      });

      return success(
        res,
        {
          token,
          user: {
            id: admin.admin_id,
            username: admin.username,
            role: "admin"
          }
        },
        "Admin logged in"
      );
    }


    // // 2️⃣ STAFF LOGIN
    // const staff = await findStaffByEmail(emailOrUsername).catch(() => null);

    // if (staff) {
    //   const valid = await comparePassword(password, staff.password);
    //   if (!valid) return error(res, "Invalid credentials", 401);

    //   const token = generateToken({
    //     id: staff.staff_id,
    //     role: staff.role || "staff",
    //     email: staff.email,
    //   });

    //   return success(
    //     res,
    //     {
    //       token,
    //       user: {
    //         id: staff.staff_id,
    //         email: staff.email,
    //         role: staff.role || "staff",
    //       }
    //     },
    //     "Staff logged in"
    //   );
    // }


    // 3️⃣ CUSTOMER LOGIN
    const customer = await findCustomerByEmail(emailOrUsername).catch(() => null);

    if (customer) {
      const valid = await comparePassword(password, customer.password);
      if (!valid) return error(res, "Invalid credentials", 401);

      const token = generateToken({
        id: customer.customer_id,
        role: "customer",
        email: customer.email
      });

      return success(
        res,
        {
          token,
          user: {
            id: customer.customer_id,
            email: customer.email,
            role: "customer",
          }
        },
        "Customer logged in"
      );
    }


    return error(res, "User not found", 404);

  } catch (err) {
    console.error(err);
    return error(res, "Login failed");
  }
}



// ============================================================
// REGISTER CUSTOMER
// ============================================================
async function registerCustomer(req, res) {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!email || !password)
      return error(res, "Email and password required", 400);

    // Check if email exists
    const existing = await findCustomerByEmail(email);
    if (existing)
      return error(res, "Email already registered", 400);

    const hashed = await hashPassword(password);

    const result = await createNewCustomer({
      first_name,
      last_name,
      email,
      password: hashed
    });

    return success(
      res,
      { id: result.insertId },
      "Customer registered",
      201
    );

  } catch (err) {
    console.error(err);
    return error(res, "Registration failed");
  }
}


module.exports = { login, registerCustomer };
