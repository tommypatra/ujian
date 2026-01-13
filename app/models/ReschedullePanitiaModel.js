const BaseModel = require('./BaseModel');
const { buildUpdate } = require('../helpers/sqlHelper');
const { mapDbError } = require('../helpers/dbErrorHelper');

class ReschedullePanitiaModel extends BaseModel {

    /* =======================
     * TABLE CONFIG
     * ======================= */
    static tableName  = 'reschedulles';
    static tableAlias = 'rs';

    static selectFields = `
        rs.id,
        rs.peserta_seleksi_id,
        rs.alasan,
        rs.dokumen_pendukung,
        rs.status,
        rs.created_at,
        rs.updated_at,
        ps.peserta_id,
        p.nama,
        p.email,
        p.nomor_peserta,
        p.hp,
        p.seleksi_id
    `;

    static joinTables = `
        INNER JOIN peserta_seleksis ps ON ps.id = rs.peserta_seleksi_id
        INNER JOIN pesertas p ON p.id = ps.peserta_id
    `;

    static countColumns = 'COUNT(rs.id)';

    static orderBy = 'ORDER BY rs.created_at DESC';

    /**
     * Kolom yang BOLEH diubah peserta
     */
    static columns = [
        'status',
        'alasan',
    ];

    static allowedFields = [
        'rs.id'
    ];

    /* =======================
     * READ
     * ======================= */

    static async findById(conn, id) {
        return super.findByKey(conn, 'rs.id', id);
    }

    static async findAll(conn, whereSql = '', params = [], limit = 10, offset = 0) {
        return super.findAll(conn, whereSql, params, limit, offset);
    }

    static async countAll(conn, whereSql = '', params = []) {
        return super.countAll(conn, whereSql, params);
    }

    /* =======================
     * WRITE (PESERTA)
     * ======================= */

    /**
     * UPDATE reschedulle (peserta)
     * TIDAK boleh update jika sudah final
     */
    static async update(conn, id, peserta_seleksi_id, data) {
        const update = buildUpdate(data, this.columns, {
            alias: 'rs'
        });

        if (!update) return 0;

        try {
            const [result] = await conn.query(
                `
                UPDATE reschedulle_seleksis rs
                INNER JOIN peserta_seleksis ps ON ps.id = rs.peserta_seleksi_id
                SET ${update.setClause}
                WHERE rs.id = ?
                  AND ps.id = ?
                `,
                [...update.values, id, peserta_seleksi_id]
            );

            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
    }

}

module.exports = ReschedullePanitiaModel;