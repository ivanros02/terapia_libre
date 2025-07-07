const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Usar carpeta temporal - el controller moverá el archivo a la carpeta correcta
    const tempDir = `/var/www/storage/temp`;
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Generar nombre temporal
    const timestamp = Date.now();
    cb(null, `temp_${timestamp}_factura.pdf`);
  }
});

module.exports = multer({
  storage,
  fileFilter: (req, file, cb) => {
    cb(null, file.mimetype === 'application/pdf');
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});