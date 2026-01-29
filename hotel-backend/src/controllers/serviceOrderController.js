const {
  createOrder,
  getAll,
  getById,
  getByBooking,
  updateOrder,
  deleteOrder
} = require("../models/serviceOrderModel");

const { success, error } = require("../utils/responseHelper");

// GET ALL
async function listServiceOrders(req, res) {
  try {
    const orders = await getAll();
    return success(res, orders);
  } catch (err) {
    return error(res, "Failed to fetch service orders");
  }
}

// GET SINGLE
async function getServiceOrder(req, res) {
  try {
    const order = await getById(req.params.id);
    if (!order) return error(res, "Order not found", 404);

    return success(res, order);
  } catch (err) {
    return error(res, "Failed to fetch service order");
  }
}

// GET ORDERS BY BOOKING
async function getOrdersByBooking(req, res) {
  try {
    const orders = await getByBooking(req.params.bookingId);
    return success(res, orders);
  } catch (err) {
    return error(res, "Failed to fetch orders");
  }
}

// CREATE
async function createServiceOrder(req, res) {
  try {
    const { booking_id, service_id, quantity } = req.body;

    if (!booking_id || !service_id || !quantity)
      return error(res, "Required fields missing", 400);

    const id = await createOrder({ booking_id, service_id, quantity });

    return success(res, { id }, "Service order created", 201);
  } catch (err) {
    return error(res, "Failed to create order");
  }
}

// UPDATE
async function updateServiceOrder(req, res) {
  try {
    const id = req.params.id;

    const exist = await getById(id);
    if (!exist) return error(res, "Order not found", 404);

    await updateOrder(id, req.body);

    return success(res, {}, "Service order updated");
  } catch (err) {
    return error(res, "Failed to update order");
  }
}

// DELETE
async function deleteServiceOrder(req, res) {
  try {
    const id = req.params.id;

    const exist = await getById(id);
    if (!exist) return error(res, "Order not found", 404);

    await deleteOrder(id);

    return success(res, {}, "Service order deleted");
  } catch (err) {
    return error(res, "Failed to delete order");
  }
}

module.exports = {
  listServiceOrders,
  getServiceOrder,
  getOrdersByBooking,
  createServiceOrder,
  updateServiceOrder,
  deleteServiceOrder
};
