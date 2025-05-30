const pool = require("../config/db");

async function aplicarCupon({ id_usuario, cupon, precio_original }) {
    if (!cupon) return { precio_final: precio_original, cupon_valido: false };

    // Obtener el cupón
    const [cuponRows] = await pool.query(
        "SELECT * FROM cupones WHERE codigo = ? AND activo = 1 LIMIT 1",
        [cupon]
    );
    if (cuponRows.length === 0) {
        return { precio_final: precio_original, cupon_valido: false };
    }

    const cuponData = cuponRows[0];

    // Verificar si ya fue usado
    if (cuponData.solo_una_vez) {
        const [usado] = await pool.query(
            "SELECT id FROM cupones_usados WHERE id_usuario = ? AND codigo_cupon = ? LIMIT 1",
            [id_usuario, cupon]
        );
        if (usado.length > 0) {
            return { precio_final: precio_original, cupon_valido: false, ya_usado: true };
        }
    }

    // Calcular nuevo precio
    const precio_final = precio_original * (1 - cuponData.descuento)


    return {
        precio_final,
        cupon_valido: true,
        cupon_codigo: cupon,
        registrar: cuponData.solo_una_vez
    };
}

async function registrarUsoCupon(id_usuario, codigo_cupon) {
    await pool.query(
        "INSERT INTO cupones_usados (id_usuario, codigo_cupon) VALUES (?, ?)",
        [id_usuario, codigo_cupon]
    );
}

module.exports = {
    aplicarCupon,
    registrarUsoCupon
};
