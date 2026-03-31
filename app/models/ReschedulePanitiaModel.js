const BaseModel = require('./BaseModel');
const { buildUpdate } = require('../helpers/sqlHelper');
const { mapDbError } = require('../helpers/dbErrorHelper');

class ReschedulePanitiaModel extends BaseModel {

    /* =======================
     * TABLE CONFIG
     * ======================= */
    static tableName  = 'reschedules';
    static tableAlias = 'rs';

    static selectFields = `
        rs.id,
        rs.id as reschedule_id,
        rs.peserta_seleksi_id,
        rs.alasan,
        rs.media_path_id,
        mp.uuid,
        rs.is_kirim,
        rs.status,
        rs.catatan_verifikasi,        
        rs.verified_user_id,
        rs.verified_at,
        rs.created_at,
        rs.updated_at,
        ps.peserta_id,
        p.nama,
        p.email,
        p.nomor_peserta,
        p.hp,
        p.seleksi_id,
        p.jenis_kelamin,
        p.tanggal_lahir,
        js.sesi,
        js.tanggal,
        js.is_selesai,
        js.is_mulai,
        js.lokasi_ujian,
        js.jam_mulai,
        js.jam_selesai

    `;

    static joinTables = `
        INNER JOIN peserta_seleksis ps ON ps.id = rs.peserta_seleksi_id
        INNER JOIN jadwal_seleksis js ON js.id = ps.jadwal_seleksi_id
        INNER JOIN pesertas p ON p.id = ps.peserta_id
        INNER JOIN media_paths mp ON mp.id = rs.media_path_id   
    `;

    static countColumns = 'COUNT(rs.id)';

    static orderBy = 'ORDER BY rs.created_at DESC';

    /**
     * Kolom yang BOLEH diubah peserta
     */
    static columns = [
        'status',
        'alasan',
        'catatan_verifikasi',
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
     * UPDATE reschedule (peserta)
     * TIDAK boleh update jika sudah final
     */
    static async update(conn, id, data) {
        const update = buildUpdate(data, this.columns, {
            alias: 'rs'
        });

        if (!update) return 0;

        try {
            const [result] = await conn.query(
                `
                UPDATE reschedules rs
                INNER JOIN peserta_seleksis ps ON ps.id = rs.peserta_seleksi_id
                SET ${update.setClause}
                WHERE rs.id = ?
                `,
                [...update.values, id]
            );

            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
    }

}

module.exports = ReschedulePanitiaModel;