const express = require("express");
const {
    loginAdmin,
    getProfesionalesAdmin,
    crearCupon,
    obtenerCupones,
    editarCupon,
    eliminarCupon
} = require("../controllers/admin.controller");
const { authenticateAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/profesionales", authenticateAdmin, getProfesionalesAdmin); // 🔹 Ruta exclusiva para admin
router.post("/cupones", authenticateAdmin, crearCupon);
router.get("/cupones", authenticateAdmin, obtenerCupones);
router.put("/cupones/:codigo", authenticateAdmin, editarCupon);   // editar
router.delete("/cupones/:codigo", authenticateAdmin, eliminarCupon); // eliminar

module.exports = router;