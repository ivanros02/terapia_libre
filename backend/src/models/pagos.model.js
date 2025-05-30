const pool = require("../config/db");

class Pago {
    static async registrarPago(id_turno, monto, metodo_pago, estado, id_transaccion) {
        const [result] = await pool.execute(
            `INSERT INTO pagos (id_turno, monto, metodo_pago, estado, id_transaccion) 
            VALUES (?, ?, ?, ?, ?)`,
            [id_turno, monto, metodo_pago, estado, id_transaccion]
        );
        return result.insertId;
    }
}

module.exports = Pago;
