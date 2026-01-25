// app/models/PesertaSeleksiModel.js
const BaseModel = require('./BaseModel');
const { buildUpdate } = require('../helpers/sqlHelper');
const { mapDbError } = require('../helpers/dbErrorHelper');

class PesertaSeleksiModel extends BaseModel {

    /* =======================
     * TABLE CONFIG
     * ======================= */
    static tableName = 'peserta_seleksis';
    static tableAlias = 'ps';

    static selectFields = `
        ps.id,
        ps.peserta_id,
        ps.jadwal_seleksi_id,
        ps.is_enter,
        ps.enter_foto,
        ps.enter_at,
        ps.is_done,
        ps.is_allow,
        ps.allow_at,
        ps.created_at,
        ps.updated_at,
        p.seleksi_id,
        p.jenis_kelamin,
        p.hp,
        p.email,
        p.is_login,
        p.nama,
        p.nomor_peserta,
        p.foto,
        p.user_name,
        p.tanggal_lahir,
        s.nama AS seleksi_nama,
        s.waktu_mulai,
        s.waktu_selesai,
        s.prefix_app,
        s.tahun,
        s.keterangan,
        js.sesi,
        js.tanggal,
        js.lokasi_ujian,
        js.jam_mulai,
        js.jam_selesai
    `;

    static joinTables = `
        LEFT JOIN pesertas p ON p.id = ps.peserta_id
        LEFT JOIN jadwal_seleksis js ON js.id = ps.jadwal_seleksi_id
        LEFT JOIN seleksis s ON s.id = p.seleksi_id
    `;

    static countColumns = 'COUNT(ps.id)';

    static orderBy = `
        ORDER BY
            s.tahun DESC,
            s.waktu_mulai DESC,
            js.sesi ASC,
            CAST(p.nomor_peserta AS UNSIGNED) ASC,
            p.nama ASC
    `;

    static columns = [
        'peserta_id',
        'jadwal_seleksi_id',
        'is_enter',
        'enter_foto',
        'enter_at',
        'is_allow',
        'is_done',
        'allow_at'
    ];

    static allowedFields = [
        'ps.id','p.id'
    ];


    /**
     * Validasi peserta milik seleksi tertentu
     * (fungsi spesifik, bukan CRUD generic)
     */
    static async _isValidPesertaSeleksi(conn, peserta_id, seleksi_id) {
        const [[row]] = await conn.query(
            `
            SELECT id
            FROM pesertas
            WHERE id = ?
              AND seleksi_id = ?
            LIMIT 1
            `,
            [peserta_id, seleksi_id]
        );

        return !!row;
    }

    /* =======================
     * READ
     * ======================= */

    

    static async findById(conn, id, options = {}) {
        return super.findByKey(conn, 'ps.id', id, options);
    }

    static async findAllByPesertaId(conn, peserta_id, options = {}) {
        return super.findAllByKey(conn, 'p.id', [peserta_id], options);
    }

    static async findAll(conn, whereSql = '', params = [], limit = 10, offset = 0, options = {}) {
        return super.findAll(conn, whereSql, params, limit, offset, options);
    }

    static async countAll(conn, whereSql = '', params = []) {
        return super.countAll(conn, whereSql, params);
    }

    /* =======================
     * WRITE (AMAN)
     * ======================= */

    // INSERT (jadwal_seleksi_id HARUS dari service / URL)
    static async insert(conn, data) {
        return super.insert(conn, data);
    }

    // UPDATE by id + seleksi_id (ANTI IDOR)
    static async update(conn, id, data,seleksi_id) {
        
        const update = buildUpdate(data, this.columns, {
            alias: 'ps'
        });
        if (!update) return 0;

        try {
            const [result] = await conn.query(
                `
                UPDATE peserta_seleksis ps
                INNER JOIN pesertas p ON p.id = ps.peserta_id
                SET ${update.setClause}
                WHERE ps.id = ?
                AND p.seleksi_id = ?
                `,
                [...update.values, id, seleksi_id]
            );

            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
    }

    // DELETE by id + seleksi_id (ANTI IDOR)
    static async delete(conn, id,seleksi_id) {
        try {
            const [result] = await conn.query(
                `DELETE ps
                FROM peserta_seleksis ps
                INNER JOIN pesertas p ON p.id = ps.peserta_id
                WHERE ps.id = ?
                AND p.seleksi_id = ?`,
                [id,seleksi_id]
            );

            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
    }

    // app/models/PesertaSeleksiModel.js
    static async enterUjian(conn, peserta_id, jadwal_seleksi_id, data) {
        try {
            const [result] = await conn.query(
                `
                UPDATE peserta_seleksis ps
                INNER JOIN pesertas p ON p.id = ps.peserta_id
                SET 
                    ps.is_enter = 1,
                    ps.enter_foto = ?,
                    ps.enter_at = NOW(),
                    ps.is_allow = 0,
                    ps.allow_at = NULL,
                    ps.updated_at = NOW()
                WHERE ps.peserta_id = ?
                    AND ps.jadwal_seleksi_id = ?
                    AND ps.is_done = 0
                    AND ps.is_enter = 0
                    AND p.is_login = 1
                `,
                [data.enter_foto, peserta_id, jadwal_seleksi_id]
            );
            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
    }

}

module.exports = PesertaSeleksiModel;