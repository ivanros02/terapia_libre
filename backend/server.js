require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
// const rateLimit = require("express-rate-limit");
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
  ? ["https://terapialibre.com.ar", "https://demo.terapialibre.com.ar"]
  : ["http://localhost:5173", "https://terapialibre.com.ar"];

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: { error: "Demasiadas solicitudes" }
// });

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'), 
  { flags: 'a' }
);

app.set('trust proxy', 1);

app.use(compression());
// app.use(limiter);
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

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: accessLogStream }));
} else {
  app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

app.get('/api_demo', (req, res) => {
  res.json({ 
    message: 'API Demo funcionando',
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api_demo/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api_demo/api/profesionales', profesionalRoutes);
app.use('/api_demo/api/auth', authRoutes);
app.use('/api_demo/api/especialidades', especialidadRoutes);
app.use('/api_demo/disponibilidad', disponibilidadRoutes);
app.use('/api_demo/api/turnos', turnosRoutes);
app.use('/api_demo/google', googleAuthRoutes);
app.use('/api_demo/google-meet', googleMeetRoutes);
app.use('/api_demo/api/mercadopago', mercadoPagoRoutes);
app.use('/api_demo/api/admin', adminRoutes);
app.use('/api_demo/api/suscripcion', suscripcionRoutes);
app.use('/api_demo/ausencias', ausenciaRoutes);
app.use('/api_demo/api/facturas', express.static(path.join(__dirname, '../storage/facturas')));

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Error interno del servidor' });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT} - Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URLs disponibles:`);
  console.log(`   Health: /api_demo/health`);
  console.log(`   API: /api_demo/api/profesionales`);
});

module.exports = app;