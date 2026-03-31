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
        ps.media_path_id,
        mp.uuid,
        mp.path, 
        mp.jenis,
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
        js.is_selesai,
        js.is_mulai,
        js.lokasi_ujian,
        js.jam_mulai,
        js.jam_selesai
    `;

    static joinTables = `
        LEFT JOIN pesertas p ON p.id = ps.peserta_id
        LEFT JOIN jadwal_seleksis js ON js.id = ps.jadwal_seleksi_id
        LEFT JOIN seleksis s ON s.id = p.seleksi_id
        LEFT JOIN media_paths mp ON mp.id = ps.media_path_id
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
        'media_path_id',
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

    static async _validasiPesertaSeleksi(conn, peserta_id,peserta_seleksi_id) {
        const [[row]] = await conn.query(
            `
                SELECT p.id FROM pesertas p
                LEFT JOIN peserta_seleksis ps ON p.id=ps.peserta_id
                WHERE p.id = ? AND ps.id = ? LIMIT 1
            `,
            [peserta_id, peserta_seleksi_id]
        );
        return !!row;
    }

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


    static async dataPeserta(conn, peserta_id) {
        const [[row]] = await conn.query(
            `
            SELECT id,email,foto,hp,nama,nomor_peserta,jenis_kelamin,tanggal_lahir,user_name,seleksi_id
            FROM pesertas p
            WHERE p.id = ?
            LIMIT 1
            `,
            [peserta_id]
        );

        return row || null;
    }

    /**
     * cari pengawas
     */
    static async cariPesertaPengawas(conn, peserta_id, user_id) {
        const [rows] = await conn.query(
            `
            SELECT ps.id, ps.media_path_id, pw.id as pengawas_seleksi_id 
            FROM peserta_seleksis ps 
            INNER JOIN pengawas_seleksis pw ON pw.jadwal_seleksi_id = ps.jadwal_seleksi_id AND pw.user_id = ?
            WHERE ps.id = ?
            LIMIT 1
            `,
            [user_id, peserta_id]
        );

        return rows.length ? rows[0] : null;
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

    // static async findAllByPesertaId(conn, peserta_id, options = {}) {
    //     return super.findAllByKey(conn, 'p.id', [peserta_id], options);
    // }

    static async findAll(conn, whereSql = '', params = [], limit = 10, offset = 0, options = {}) {
        return super.findAll(conn, whereSql, params, limit, offset, options);
    }

    static async countAll(conn, whereSql = '', params = []) {
        return super.countAll(conn, whereSql, params);
    }

    /* =======================
     * WRITE (AMAN)
     * ======================= */

    // INSERT (jadwal_seleksi_id apiRUS dari service / URL)
    static async insert(conn, data) {
        return super.insert(conn, data);
    }

    static async getValidPesertaSeleksiIds(conn, peserta_seleksi_ids, jadwal_seleksi_id) {
        const [rows] = await conn.query(
            `
            SELECT id 
            FROM peserta_seleksis 
            WHERE id IN (?)
            AND jadwal_seleksi_id = ?
            `,
            [peserta_seleksi_ids, jadwal_seleksi_id]
        );

        return rows.map(r => r.id);
    }    

    static async getPesertaByPesertaSeleksiIds(conn, peserta_ids) {
        const [rows] = await conn.query(
            `
            SELECT ps.id as peserta_seleksi_id, ps.peserta_id
            FROM peserta_seleksis ps
            WHERE ps.peserta_id IN (?) 
            `,
            [peserta_ids]
        );
        return rows;
    }

    static async insertBulkIgnore(conn, values) {
        if (!values.length) return 0;

        const placeholders = values.map(() => '(?, ?)').join(',');
        const flatValues = values.flat();

        const [result] = await conn.query(
            `
            INSERT IGNORE INTO peserta_seleksis 
            (peserta_id, jadwal_seleksi_id)
            VALUES ${placeholders}
            `,
            flatValues
        );

        return result.affectedRows;
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
    static async enterUjian(conn, peserta_id, jadwal_seleksi_id, media_path_id) {
        try {

            const [result] = await conn.query(
                `
                UPDATE peserta_seleksis ps
                INNER JOIN pesertas p ON p.id = ps.peserta_id
                INNER JOIN jadwal_seleksis ss ON ss.id = ps.jadwal_seleksi_id
                SET 
                    ps.is_enter = 1,
                    ps.media_path_id = ?,
                    ps.enter_at = NOW(),
                    ps.is_allow = 0,
                    ps.allow_at = NULL,
                    ps.updated_at = NOW()
                WHERE ps.peserta_id = ?
                    AND ss.is_mulai = 1 AND (ss.is_selesai IS NULL OR ss.is_selesai = 0)
                    AND ps.jadwal_seleksi_id = ?
                    AND ps.is_done = 0
                    AND ps.is_enter = 0
                    AND p.is_login = 1
                `,
                [media_path_id, peserta_id, jadwal_seleksi_id]
            );
            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
    }

}

module.exports = PesertaSeleksiModel;