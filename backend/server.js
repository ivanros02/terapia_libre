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

const app = express();
const server = http.createServer(app);

// Configuración de Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Cambiar en produccion por dominio https://terapialibre.com.ar
        methods: ["GET", "POST"],
    },
});

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Rutas para produccion agregar /api_terapia
app.use("/api/profesionales", profesionalRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/especialidades", especialidadRoutes);
app.use("/disponibilidad", disponibilidadRoutes);
app.use("/api/turnos", turnosRoutes);
app.use('/google', googleAuthRoutes);
// Pasar `io` al cargar las rutas del chat
app.use("/api/chat", (req, res, next) => {
    req.io = io;
    next();
  }, chatRoutes);

// Socket.io
io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    // Unirse a una sala de chat
    socket.on("join_chat", (chatId) => {
        socket.join(chatId);
        console.log(`Usuario ${socket.id} se unió al chat ${chatId}`);
    });

    // Escuchar mensajes
    socket.on("send_message", (data) => {
        const { chatId, senderId, message } = data;
        io.to(chatId).emit("receive_message", { senderId, message });
        console.log(`Mensaje enviado al chat ${chatId}: ${message}`);
    });

    // Desconexión
    socket.on("disconnect", () => {
        console.log("Usuario desconectado:", socket.id);
    });
});

module.exports = { app, server }; // NO exportamos `io` aquí para evitar la dependencia circular

// Iniciar servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));


