const {
  createService,
  getAll,
  getById,
  updateService,
  deleteService
} = require("../models/serviceModel");

const { success, error } = require("../utils/responseHelper");

// GET ALL SERVICES
async function listServices(req, res) {
  try {
    const services = await getAll();
    return success(res, services);
  } catch (err) {
    return error(res, "Failed to fetch services");
  }
}

// GET SINGLE SERVICE
async function getService(req, res) {
  try {
    const service = await getById(req.params.id);
    if (!service) return error(res, "Service not found", 404);

    return success(res, service);
  } catch (err) {
    return error(res, "Failed to fetch service");
  }
}

// CREATE SERVICE
async function createServiceController(req, res) {
  try {
    const { service_name, price, description } = req.body;

    if (!service_name || !price)
      return error(res, "Service name & price required", 400);

    const id = await createService({ service_name, price, description });

    return success(res, { id }, "Service created", 201);
  } catch (err) {
    return error(res, "Failed to create service");
  }
}

// UPDATE SERVICE
async function updateServiceController(req, res) {
  try {
    const id = req.params.id;
    const service = await getById(id);

    if (!service) return error(res, "Service not found", 404);

    await updateService(id, req.body);

    return success(res, {}, "Service updated");
  } catch (err) {
    return error(res, "Failed to update service");
  }
}

// DELETE SERVICE
async function deleteServiceController(req, res) {
  try {
    const id = req.params.id;

    const service = await getById(id);
    if (!service) return error(res, "Service not found", 404);

    await deleteService(id);

    return success(res, {}, "Service deleted");
  } catch (err) {
    return error(res, "Failed to delete service");
  }
}

module.exports = {
  listServices,
  getService,
  createService: createServiceController,
  updateService: updateServiceController,
  deleteService: deleteServiceController
};
