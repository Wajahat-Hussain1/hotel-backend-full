const {
  createFeedback,
  getAll,
  getById,
  updateFeedback,
  deleteFeedback
} = require("../models/feedbackModel");

const { success, error } = require("../utils/responseHelper");

// GET ALL
async function listFeedback(req, res) {
  try {
    const rows = await getAll();
    return success(res, rows);
  } catch (err) {
    return error(res, "Failed to fetch feedback");
  }
}

// GET SINGLE
async function getFeedback(req, res) {
  try {
    const feedback = await getById(req.params.id);
    if (!feedback) return error(res, "Feedback not found", 404);

    return success(res, feedback);
  } catch (err) {
    return error(res, "Failed to fetch feedback");
  }
}

// CREATE (customer only)
async function createFeedbackController(req, res) {
  try {
    const { booking_id, rating, comments } = req.body;

    if (!booking_id || !rating)
      return error(res, "Booking ID & rating required", 400);

    if (rating < 1 || rating > 5)
      return error(res, "Rating must be between 1 and 5", 400);

    const id = await createFeedback({
      booking_id,
      rating,
      comments: comments || ""
    });

    return success(res, { id }, "Feedback created", 201);
  } catch (err) {
    return error(res, "Failed to create feedback");
  }
}

// UPDATE (customer or admin)
async function updateFeedbackController(req, res) {
  try {
    const id = req.params.id;
    const feedback = await getById(id);

    if (!feedback) return error(res, "Feedback not found", 404);

    await updateFeedback(id, req.body);

    return success(res, {}, "Feedback updated");
  } catch (err) {
    return error(res, "Failed to update feedback");
  }
}

// DELETE (admin only)
async function deleteFeedbackController(req, res) {
  try {
    const id = req.params.id;

    const feedback = await getById(id);
    if (!feedback) return error(res, "Feedback not found", 404);

    await deleteFeedback(id);

    return success(res, {}, "Feedback deleted");
  } catch (err) {
    return error(res, "Failed to delete feedback");
  }
}

module.exports = {
  listFeedback,
  getFeedback,
  createFeedback: createFeedbackController,
  updateFeedback: updateFeedbackController,
  deleteFeedback: deleteFeedbackController
};
