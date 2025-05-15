const bcrypt = require('bcrypt');

const contraseña = '123';
const saltRounds = 10;

bcrypt.hash(contraseña, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error generando el hash:', err);
        return;
    }
    console.log('🔐 Hash generado para "123":', hash);
});
