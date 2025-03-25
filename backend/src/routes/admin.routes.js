const express = require("express");
const { loginAdmin } = require("../controllers/admin.controller");
const { getProfesionalesAdmin } = require("../controllers/admin.controller");
const { authenticateAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/profesionales", authenticateAdmin, getProfesionalesAdmin); // 🔹 Ruta exclusiva para admin


module.exports = router;