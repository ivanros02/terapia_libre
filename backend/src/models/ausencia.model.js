const pool = require("../config/db");

class AusenciaModel {
    // Crear una nueva ausencia
    static async create(ausenciaData) {
        const { id_profesional, fecha, hora_inicio, hora_fin, motivo } = ausenciaData;
        
        try {
            const query = `
                INSERT INTO ausencias (id_profesional, fecha, hora_inicio, hora_fin, motivo)
                VALUES (?, ?, ?, ?, ?)
            `;
            
            const [result] = await pool.execute(query, [
                id_profesional,
                fecha,
                hora_inicio,
                hora_fin,
                motivo || null
            ]);
            
            return {
                id_ausencia: result.insertId,
                ...ausenciaData
            };
        } catch (error) {
            throw error;
        }
    }

    // Obtener todas las ausencias de un profesional
    static async getByProfesionalId(id_profesional) {
        try {
            const query = `
                SELECT 
                    id_ausencia,
                    id_profesional,
                    fecha,
                    TIME_FORMAT(hora_inicio, '%H:%i') as hora_inicio,
                    TIME_FORMAT(hora_fin, '%H:%i') as hora_fin,
                    motivo,
                    creado_en
                FROM ausencias
                WHERE id_profesional = ?
                ORDER BY fecha DESC, hora_inicio ASC
            `;
            
            const [rows] = await pool.execute(query, [id_profesional]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Obtener una ausencia por ID
    static async getById(id_ausencia) {
        try {
            const query = `
                SELECT 
                    id_ausencia,
                    id_profesional,
                    fecha,
                    TIME_FORMAT(hora_inicio, '%H:%i') as hora_inicio,
                    TIME_FORMAT(hora_fin, '%H:%i') as hora_fin,
                    motivo,
                    creado_en
                FROM ausencias
                WHERE id_ausencia = ?
            `;
            
            const [rows] = await pool.execute(query, [id_ausencia]);
            return rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar una ausencia
    static async update(id_ausencia, ausenciaData) {
        const { fecha, hora_inicio, hora_fin, motivo } = ausenciaData;
        
        try {
            const query = `
                UPDATE ausencias
                SET fecha = ?, hora_inicio = ?, hora_fin = ?, motivo = ?
                WHERE id_ausencia = ?
            `;
            
            const [result] = await pool.execute(query, [
                fecha,
                hora_inicio,
                hora_fin,
                motivo || null,
                id_ausencia
            ]);
            
            if (result.affectedRows === 0) {
                return null;
            }
            
            return await this.getById(id_ausencia);
        } catch (error) {
            throw error;
        }
    }

    // Eliminar una ausencia
    static async delete(id_ausencia) {
        try {
            const query = `DELETE FROM ausencias WHERE id_ausencia = ?`;
            const [result] = await pool.execute(query, [id_ausencia]);
            
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Verificar si hay conflictos de horario
    static async checkConflict(id_profesional, fecha, hora_inicio, hora_fin, id_ausencia = null) {
        try {
            let query = `
                SELECT COUNT(*) as count
                FROM ausencias
                WHERE id_profesional = ?
                AND fecha = ?
                AND (
                    (hora_inicio <= ? AND hora_fin > ?) OR
                    (hora_inicio < ? AND hora_fin >= ?) OR
                    (hora_inicio >= ? AND hora_fin <= ?)
                )
            `;
            
            const params = [
                id_profesional,
                fecha,
                hora_inicio, hora_inicio,
                hora_fin, hora_fin,
                hora_inicio, hora_fin
            ];
            
            // Si es una actualización, excluir el registro actual
            if (id_ausencia) {
                query += ` AND id_ausencia != ?`;
                params.push(id_ausencia);
            }
            
            const [rows] = await pool.execute(query, params);
            return rows[0].count > 0;
        } catch (error) {
            throw error;
        }
    }

    // Obtener ausencias por rango de fechas
    static async getByDateRange(id_profesional, fecha_inicio, fecha_fin) {
        try {
            const query = `
                SELECT 
                    id_ausencia,
                    id_profesional,
                    fecha,
                    TIME_FORMAT(hora_inicio, '%H:%i') as hora_inicio,
                    TIME_FORMAT(hora_fin, '%H:%i') as hora_fin,
                    motivo,
                    creado_en
                FROM ausencias
                WHERE id_profesional = ?
                AND fecha BETWEEN ? AND ?
                ORDER BY fecha ASC, hora_inicio ASC
            `;
            
            const [rows] = await pool.execute(query, [
                id_profesional,
                fecha_inicio,
                fecha_fin
            ]);
            
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AusenciaModel;