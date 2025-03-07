require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const profesionalRoutes = require("./src/routes/profesional.routes");
const authRoutes = require("./src/routes/auth.routes");
const especialidadRoutes = require("./src/routes/especialidad.routes");
const disponibilidadRoutes = require("./src/routes/disponibilidad.routes");
const turnosRoutes = require("./src/routes/turnos.routes");
const googleAuthRoutes = require('./src/routes/googleAuth.routes');
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Rutas
app.use("/api/profesionales", profesionalRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/especialidades", especialidadRoutes);
app.use("/disponibilidad", disponibilidadRoutes);
app.use("/turnos", turnosRoutes);
app.use('/google', googleAuthRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
