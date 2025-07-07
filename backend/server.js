require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");

const profesionalRoutes = require("./src/routes/profesional.routes");
const authRoutes = require("./src/routes/auth.routes");
const especialidadRoutes = require("./src/routes/especialidad.routes");
const disponibilidadRoutes = require("./src/routes/disponibilidad.routes");
const turnosRoutes = require("./src/routes/turnos.routes");
const googleAuthRoutes = require('./src/routes/googleAuth.routes');
const mercadoPagoRoutes = require("./src/routes/mercadoPago.routes");
const googleMeetRoutes = require("./src/routes/googleMeet.routes");
const adminRoutes = require("./src/routes/admin.routes");
const suscripcionRoutes = require("./src/routes/suscripcion.routes");
const ausenciaRoutes = require("./src/routes/ausencia.routes");

const app = express();

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ["https://terapialibre.com.ar"]
  : ["http://localhost:5173", "https://terapialibre.com.ar"];

// Rate limiting general
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: { error: "Demasiadas solicitudes" }
});

// Logs para producción
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'), 
  { flags: 'a' }
);

// Middlewares
app.use(compression());
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"]
    }
  }
}));

// Logs
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: accessLogStream }));
} else {
  app.use(morgan('dev'));
}

// Servir archivos estáticos del build de React
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes con prefijo para producción
const apiPrefix = process.env.NODE_ENV === 'production' ? '/api_terapia' : '';

app.use(`${apiPrefix}/api/profesionales`, profesionalRoutes);
app.use(`${apiPrefix}/api/auth`, authRoutes);
app.use(`${apiPrefix}/api/especialidades`, especialidadRoutes);
app.use(`${apiPrefix}/disponibilidad`, disponibilidadRoutes);
app.use(`${apiPrefix}/api/turnos`, turnosRoutes);
app.use(`${apiPrefix}/google`, googleAuthRoutes);
app.use(`${apiPrefix}/google-meet`, googleMeetRoutes);
app.use(`${apiPrefix}/api/mercadopago`, mercadoPagoRoutes);
app.use(`${apiPrefix}/api/admin`, adminRoutes);
app.use(`${apiPrefix}/api/suscripcion`, suscripcionRoutes);
app.use(`${apiPrefix}/ausencias`, ausenciaRoutes);
app.use(`${apiPrefix}/api/facturas`, express.static('/var/www/storage/facturas'));

// Servir React app para todas las rutas no API
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Error interno del servidor' });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT} - Modo: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;