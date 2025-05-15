require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");

const profesionalRoutes = require("./src/routes/profesional.routes");
const authRoutes = require("./src/routes/auth.routes");
const especialidadRoutes = require("./src/routes/especialidad.routes");
const disponibilidadRoutes = require("./src/routes/disponibilidad.routes");
const turnosRoutes = require("./src/routes/turnos.routes");
const googleAuthRoutes = require('./src/routes/googleAuth.routes');
const chatRoutes = require('./src/routes/chat.routes'); // Nueva ruta para el chat
const mercadoPagoRoutes = require("./src/routes/mercadoPago.routes");
const googleMeetRoutes = require("./src/routes/googleMeet.routes");
const adminRoutes = require("./src/routes/admin.routes"); // Nueva ruta para el chat
const suscripcionRoutes = require("./src/routes/suscripcion.routes");
const app = express();
const server = http.createServer(app);


// Configuración de Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});


// Middlewares
app.use(express.json());
const allowedOrigins = [
    "http://localhost:5173",
    "https://terapialibre.com.ar"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(helmet());

// Rutas para produccion agregar /api_terapia
app.use("/api/profesionales", profesionalRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/especialidades", especialidadRoutes);
app.use("/disponibilidad", disponibilidadRoutes);
app.use("/api/turnos", turnosRoutes);
app.use('/google', googleAuthRoutes);
app.use("/google-meet", googleMeetRoutes);
app.use("/api/mercadopago", mercadoPagoRoutes);
app.use("/api/admin", adminRoutes); // 🔹 Agregamos la ruta de administración
app.use("/api/suscripcion", suscripcionRoutes);

// Pasar `io` al cargar las rutas del chat
app.use("/api/chat", (req, res, next) => {
    req.io = io;
    next();
}, chatRoutes);

// Socket.io
io.on("connection", (socket) => {
    console.log("🔌 Usuario conectado:", socket.id);

    // Manejo de unión a sala personal basada en userId
    socket.on("join_user", (userId) => {
        if (userId) {
            socket.join(userId.toString());
            console.log(`✅ Usuario ${userId} se unió a su sala personal`);
        }
    });

    // Evento de unirse a un chat específico
    socket.on("join_chat", (chatId) => {
        socket.join(chatId);
        console.log(`🛎️ Usuario ${socket.id} se unió al chat ${chatId}`);
    });

    socket.on("disconnect", () => {
        console.log("⛔ Usuario desconectado:", socket.id);
    });
});


module.exports = { app, server }; // NO exportamos `io` aquí para evitar la dependencia circular

// Iniciar servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));


