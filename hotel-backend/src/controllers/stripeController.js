const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const { getById } = require("../models/bookingModel");
const { error } = require("../utils/responseHelper");

const createCheckoutSession = async (req, res) => {
  try {
    const { booking_id } = req.body;
    const user = req.user;

    if (!booking_id)
      return error(res, "Booking ID required", 400);

    const booking = await getById(booking_id);
    if (!booking)
      return error(res, "Booking not found", 404);

    // 🔐 customer ownership check
    if (user.role === "customer" && booking.customer_id !== user.id) {
      return error(res, "Unauthorized", 403);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: {
              name: `Room Booking #${booking.booking_id}`,
            },
            unit_amount: booking.total_price * 100, // paisa
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/payment/success?booking_id=${booking.booking_id}`,
      cancel_url: `http://localhost:3000/payment/cancel?booking_id=${booking.booking_id}`,
      metadata: {
        booking_id: booking.booking_id,
      },
    });

    return res.json({ url: session.url });

  } catch (err) {
    console.error("Stripe Error:", err);
    return error(res, "Stripe session failed");
  }
};

module.exports = { createCheckoutSession };
