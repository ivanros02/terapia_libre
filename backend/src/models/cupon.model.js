const pool = require("../config/db");

class Cupon {
    static async crear({ codigo, descripcion, descuento, activo = 1, solo_una_vez = 1, dado_por }) {
        await pool.query(
            `INSERT INTO cupones (codigo, descripcion, descuento, activo, solo_una_vez, dado_por)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [codigo, descripcion, descuento, activo ? 1 : 0, solo_una_vez ? 1 : 0, dado_por]
        );
    }

    // Opcional: para listar, editar o eliminar cupones
    static async obtenerTodos() {
        const [rows] = await pool.query(`SELECT * FROM cupones ORDER BY codigo`);
        return rows;
    }

    static async editar({ codigo, descripcion, descuento, activo, solo_una_vez, dado_por }) {
        await pool.query(
            `UPDATE cupones
     SET descripcion = ?, descuento = ?, activo = ?, solo_una_vez = ?, dado_por = ?
     WHERE codigo = ?`,
            [descripcion, descuento, activo ? 1 : 0, solo_una_vez ? 1 : 0, dado_por, codigo]
        );
    }

    static async eliminar(codigo) {
        await pool.query(`DELETE FROM cupones WHERE codigo = ?`, [codigo]);
    }

}


module.exports = Cupon;
