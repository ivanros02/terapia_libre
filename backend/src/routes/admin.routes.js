const express = require("express");
const adminController = require("../controllers/admin.controller");
const { authenticateAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/login", adminController.loginAdmin);
router.get("/profesionales", authenticateAdmin, adminController.getProfesionalesAdmin); // 🔹 Ruta exclusiva para admin
router.get("/usuarios", authenticateAdmin, adminController.getUsuariosAdmin);
router.get("/dashboard-stats", authenticateAdmin, adminController.getDashboardStats);
router.get("/turnos", authenticateAdmin, adminController.getTurnosCompletos);
router.get("/turnos/:id", authenticateAdmin, adminController.getDetallesTurno);
router.get("/pagos", authenticateAdmin, adminController.getPagosCompletos);
router.post("/cupones", authenticateAdmin, adminController.crearCupon);
router.get("/cupones", authenticateAdmin, adminController.obtenerCupones);
router.put("/cupones/:codigo", authenticateAdmin, adminController.editarCupon);   // editar
router.delete("/cupones/:codigo", authenticateAdmin, adminController.eliminarCupon); // eliminar

module.exports = router;