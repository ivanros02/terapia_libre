const pool = require("../config/db");

async function aplicarCupon({ id_usuario, cupon, precio_original }) {
    // 🔧 Convertir precio_original a número desde el inicio
    const precioOriginalNum = parseFloat(precio_original);
    
    console.log(`🎟️ Aplicando cupón: "${cupon || 'N/A'}" al precio $${precioOriginalNum}`);
    
    // ✅ Caso 1: No hay cupón o está vacío
    if (!cupon || cupon.trim() === '') {
        console.log("📝 Sin cupón - precio original");
        return { 
            precio_final: precioOriginalNum, 
            cupon_valido: false,
            registrar: false,
            cupon_codigo: null
        };
    }

    try {
        // ✅ Obtener el cupón de la base de datos
        const [cuponRows] = await pool.query(
            "SELECT * FROM cupones WHERE codigo = ? AND activo = 1 LIMIT 1",
            [cupon.trim().toUpperCase()]
        );
        
        if (cuponRows.length === 0) {
            console.log(`❌ Cupón "${cupon}" no encontrado o inactivo`);
            return { 
                precio_final: precioOriginalNum, 
                cupon_valido: false,
                registrar: false,
                cupon_codigo: null
            };
        }

        const cuponData = cuponRows[0];
        console.log(`🔍 Cupón encontrado: ${cuponData.codigo} - Descuento: ${cuponData.descuento * 100}%`);

        // ✅ Verificar si ya fue usado (si es de solo una vez)
        if (cuponData.solo_una_vez) {
            const [usado] = await pool.query(
                "SELECT id FROM cupones_usados WHERE id_usuario = ? AND codigo_cupon = ? LIMIT 1",
                [id_usuario, cupon.trim().toUpperCase()]
            );
            
            if (usado.length > 0) {
                console.log(`❌ Cupón "${cupon}" ya fue usado por el usuario ${id_usuario}`);
                return { 
                    precio_final: precioOriginalNum, 
                    cupon_valido: false,
                    registrar: false,
                    cupon_codigo: null,
                    ya_usado: true 
                };
            }
        }

        // ✅ Calcular nuevo precio con descuento
        const descuentoDecimal = parseFloat(cuponData.descuento);
        const montoDescuento = precioOriginalNum * descuentoDecimal;
        const precio_final = precioOriginalNum - montoDescuento;

        console.log(`💰 Precio original: $${precioOriginalNum}`);
        console.log(`💸 Descuento aplicado: $${montoDescuento.toFixed(2)} (${(descuentoDecimal * 100)}%)`);
        console.log(`💳 Precio final: $${precio_final.toFixed(2)}`);

        return {
            precio_final: parseFloat(precio_final.toFixed(2)), // 🔧 Asegurar que sea número
            cupon_valido: true,
            cupon_codigo: cuponData.codigo,
            registrar: cuponData.solo_una_vez,
            descuento_aplicado: montoDescuento,
            porcentaje_descuento: descuentoDecimal * 100
        };

    } catch (error) {
        console.error("❌ Error aplicando cupón:", error);
        return { 
            precio_final: precioOriginalNum, 
            cupon_valido: false,
            registrar: false,
            cupon_codigo: null,
            error: error.message
        };
    }
}

async function registrarUsoCupon(id_usuario, codigo_cupon) {
    try {
        console.log(`📝 Registrando uso del cupón "${codigo_cupon}" para usuario ${id_usuario}`);
        
        await pool.query(
            "INSERT INTO cupones_usados (id_usuario, codigo_cupon, fecha_uso) VALUES (?, ?, NOW())",
            [id_usuario, codigo_cupon.trim().toUpperCase()]
        );
        
        console.log(`✅ Uso del cupón registrado exitosamente`);
    } catch (error) {
        console.error("❌ Error registrando uso del cupón:", error);
        throw error;
    }
}

// 🔧 Función adicional para limpiar cupones expirados (opcional)
async function limpiarCuponesExpirados() {
    try {
        const [result] = await pool.query(
            "UPDATE cupones SET activo = 0 WHERE fecha_expiracion < NOW() AND activo = 1"
        );
        
        if (result.affectedRows > 0) {
            console.log(`🧹 ${result.affectedRows} cupones expirados desactivados`);
        }
        
        return result.affectedRows;
    } catch (error) {
        console.error("❌ Error limpiando cupones expirados:", error);
        return 0;
    }
}

// 🔧 Función para validar estructura de cupón (opcional)
function validarFormatoCupon(codigo) {
    if (!codigo || typeof codigo !== 'string') {
        return false;
    }
    
    const codigoLimpio = codigo.trim().toUpperCase();
    
    // Validaciones básicas
    if (codigoLimpio.length < 3 || codigoLimpio.length > 20) {
        return false;
    }
    
    // Solo letras, números y algunos caracteres especiales
    const formatoValido = /^[A-Z0-9_-]+$/.test(codigoLimpio);
    
    return formatoValido;
}

module.exports = {
    aplicarCupon,
    registrarUsoCupon,
    limpiarCuponesExpirados,
    validarFormatoCupon
};