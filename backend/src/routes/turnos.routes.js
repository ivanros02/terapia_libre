const express = require("express");
const router = express.Router();
const turnosController = require("../controllers/turnos.controller");
const upload = require("../middlewares/upload");

router.post("/reservar", turnosController.reservarTurno);
router.get("/", turnosController.obtenerTurnos);
router.put("/cancelar", turnosController.cancelarTurno);
router.get("/usuario/:id_usuario", turnosController.obtenerTurnosPorUsuario);
router.get("/profesional/:id_profesional", turnosController.obtenerTurnosPorProfesional);
router.get("/profesionalDashboard/:id_profesional", turnosController.obtenerTurnosPorProfesionalDashboard);
router.get("/usuarioDashboard/:id_usuario", turnosController.obtenerTurnosPorUsuarioDashboard);
router.get("/:id/turno-hoy", turnosController.getTurnoDelDia);
router.get("/:id/turnos-hoy-paciente", turnosController.getTurnoDelDiaPaciente);
router.get("/:id/nuevos-pacientes", turnosController.getNuevosPacientes);
router.get("/:id/progreso", turnosController.getProgress);
router.post("/guardar-google-event", turnosController.guardarGoogleEvent);
router.get("/usuario/:id_usuario/historial", turnosController.obtenerHistorialUsuario);
router.get("/usuario/:id_usuario/terapeuta", turnosController.obtenerTerapeutaUsuario);
router.post("/factura/upload", upload.single('factura'), turnosController.subirFactura);

module.exports = router;
