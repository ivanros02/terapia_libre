const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const Cupon = require("../models/cupon.model");

const generarToken = (id, rol) => {
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.loginAdmin = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        const admin = await Admin.findByEmail(correo);

        if (!admin) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos." });
        }

        const esCorrecto = await bcrypt.compare(contrasena, admin.contrasena);
        if (!esCorrecto) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos." });
        }

        res.json({
            message: "Inicio de sesión exitoso.",
            token: generarToken(admin.id),  // ✅ Ahora solo el ID
            admin: { id: admin.id, nombre: admin.nombre, correo: admin.correo }
        });

    } catch (error) {
        console.error("Error en loginAdmin:", error);
        res.status(400).json({
            message: "Ocurrió un error inesperado. Verificá los datos o intentá más tarde.",
        });
    }
};

exports.getProfesionalesAdmin = async (req, res) => {
    try {
        // 🔹 Obtener todos los profesionales sin límite ni paginación
        const profesionales = await Admin.getAllWithoutFilters();

        res.json({ professionals: profesionales });
    } catch (error) {
        console.error("Error al obtener profesionales para admin:", error);
        res.status(400).json({
            message: "No se pudieron obtener los profesionales."
        });
    }
};

exports.crearCupon = async (req, res) => {
    try {
        const { codigo, descripcion, descuento, activo, solo_una_vez, dado_por } = req.body;

        if (!codigo || !descuento) {
            return res.status(400).json({ message: "Código y descuento son obligatorios." });
        }

        await Cupon.crear({ codigo, descripcion, descuento, activo, solo_una_vez, dado_por });
        res.json({ message: "Cupón creado correctamente." });

    } catch (error) {
        console.error("Error al crear cupón:", error);
        res.status(500).json({ message: "Error interno al crear el cupón." });
    }
};

exports.obtenerCupones = async (req, res) => {
    try {
        const cupones = await Cupon.obtenerTodos();
        res.json(cupones);
    } catch (error) {
        console.error("Error al obtener cupones:", error);
        res.status(500).json({ message: "Error al obtener cupones" });
    }
};

exports.editarCupon = async (req, res) => {
    try {
        const { codigo } = req.params;
        const { descripcion, descuento, activo, solo_una_vez, dado_por } = req.body;

        await Cupon.editar({ codigo, descripcion, descuento, activo, solo_una_vez, dado_por });

        res.json({ message: "Cupón actualizado correctamente." });
    } catch (error) {
        console.error("Error al editar cupón:", error);
        res.status(500).json({ message: "Error al actualizar cupón." });
    }
};

exports.eliminarCupon = async (req, res) => {
    try {
        const { codigo } = req.params;
        await Cupon.eliminar(codigo);
        res.json({ message: "Cupón eliminado correctamente." });
    } catch (error) {
        console.error("Error al eliminar cupón:", error);
        res.status(500).json({ message: "Error al eliminar cupón." });
    }
};

exports.getUsuariosAdmin = async (req, res) => {
    try {
        const usuarios = await Admin.getAllUsuarios();
        res.json({ users: usuarios });
    } catch (error) {
        console.error("Error al obtener usuarios para admin:", error);
        res.status(400).json({
            message: "No se pudieron obtener los usuarios."
        });
    }
};

// 🔹 Obtener dashboard completo con estadísticas
exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await Admin.getDashboardStatistics();
        res.json(stats);
    } catch (error) {
        console.error("Error al obtener estadísticas del dashboard:", error);
        res.status(400).json({ message: "No se pudieron obtener las estadísticas." });
    }
};

// 🔹 Obtener todos los turnos con información completa
exports.getTurnosCompletos = async (req, res) => {
    try {
        const { estado, fecha_desde, fecha_hasta, id_usuario, id_profesional } = req.query;

        const turnos = await Admin.getTurnosWithDetails({
            estado,
            fecha_desde,
            fecha_hasta,
            id_usuario,
            id_profesional
        });

        res.json({ turnos });
    } catch (error) {
        console.error("Error al obtener turnos completos:", error);
        res.status(400).json({ message: "No se pudieron obtener los turnos." });
    }
};

// 🔹 Obtener detalles completos de un turno específico
exports.getDetallesTurno = async (req, res) => {
    try {
        const { id } = req.params;
        const detalles = await Admin.getTurnoCompleteDetails(id);

        if (!detalles) {
            return res.status(404).json({ message: "Turno no encontrado." });
        }

        // 🔹 Convertir campos numéricos
        const detallesConvertidos = {
            ...detalles,
            monto: detalles.monto ? parseFloat(detalles.monto) : null,
            valor: detalles.valor ? parseFloat(detalles.valor) : null
        };

        res.json(detallesConvertidos);
    } catch (error) {
        console.error("Error al obtener detalles del turno:", error);
        res.status(400).json({ message: "No se pudieron obtener los detalles del turno." });
    }
};

// 🔹 Obtener pagos con filtros
exports.getPagosCompletos = async (req, res) => {
    try {
        const { estado, metodo_pago, fecha_desde, fecha_hasta, tiene_cupon } = req.query;

        const pagos = await Admin.getPagosWithDetails({
            estado,
            metodo_pago,
            fecha_desde,
            fecha_hasta,
            tiene_cupon
        });

        // 🔹 Convertir campos numéricos de string a number
        const pagosConvertidos = pagos.map(pago => {
            return {
                ...pago,
                monto: pago.monto ? parseFloat(pago.monto) : 0,
                id_pago: parseInt(pago.id_pago) || pago.id_pago
            };
        });

        res.json({ pagos: pagosConvertidos });
    } catch (error) {
        console.error("Error al obtener pagos:", error);
        res.status(400).json({ message: "No se pudieron obtener los pagos." });
    }
};