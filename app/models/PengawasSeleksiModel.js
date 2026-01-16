// app/models/PengawasSeleksiModel.js
const BaseModel = require('./BaseModel');
const { buildUpdate } = require('../helpers/sqlHelper');
const { mapDbError } = require('../helpers/dbErrorHelper');

class PengawasSeleksiModel extends BaseModel {

    /* =======================
     * TABLE CONFIG
     * ======================= */
    static tableName = 'pengawas_seleksis';
    static tableAlias = 'ps';

    static selectFields = `
        ps.id,
        ps.jadwal_seleksi_id,
        ps.name,
        ps.user_name,
        ps.created_at,
        ps.updated_at,
        js.seleksi_id,
        js.sesi,
        js.tanggal,
        js.lokasi_ujian,
        js.jam_mulai,
        js.jam_selesai,
        js.status,
        s.nama AS seleksi_nama,
        s.prefix_app,
        s.tahun,
        s.keterangan AS seleksi_keterangan
    `;

    static joinTables = `
        LEFT JOIN jadwal_seleksis js ON js.id = ps.jadwal_seleksi_id
        LEFT JOIN seleksis s ON s.id = js.seleksi_id
    `;

    static countColumns = 'COUNT(ps.id)';

    static orderBy = `
        ORDER BY
            s.tahun DESC,
            s.waktu_mulai DESC,
            js.sesi ASC,
            js.tanggal ASC,
            js.jam_mulai ASC,
            js.lokasi_ujian,
            ps.name ASC
    `;

    static columns = [
        'jadwal_seleksi_id',
        'name',
        'user_name',
        'password'
    ];

    static allowedFields = [
        'ps.id',
        'js.id',
        'js.sesi'
    ];

    /* =======================
     * READ
     * ======================= */

    static async findById(conn, id) {
        return super.findByKey(conn, 'ps.id', id);
    }

    // static async findByJadwalId(conn, jadwalId) {
    //     return super.findByKey(conn, 'js.id', jadwalId);
    // }

    static async findByJadwalIds(conn, jadwalIds = []) {
        return super.findAllByKey(conn, 'js.id', jadwalIds);
    }

    static async findBySesi(conn, sesi) {
        return super.findByKey(conn, 'js.sesi', sesi);
    }

    static async findAll(conn, whereSql = '', params = [], limit = 10, offset = 0) {
        return super.findAll(conn, whereSql, params, limit, offset);
    }

    static async countAll(conn, whereSql = '', params = []) {
        return super.countAll(conn, whereSql, params);
    }

    /**
     * Cari username terakhir dalam satu jadwal seleksi
     * (fungsi khusus, bukan generic CRUD)
     */
    static async findLastUsername(conn, seleksi_id) {
        const [[row]] = await conn.query(
            `
            SELECT ps.user_name
            FROM pengawas_seleksis ps
            LEFT JOIN jadwal_seleksis js ON js.id=ps.jadwal_seleksi_id
            WHERE js.seleksi_id = ?
            ORDER BY LENGTH(ps.user_name) DESC, ps.user_name DESC
            LIMIT 1
            `,
            [seleksi_id]
        );
        return row ? row.user_name : null;
    }

    /* =======================
     * WRITE (AMAN)
     * ======================= */

    // INSERT (jadwal_seleksi_id harus dari service / URL)
    static async insert(conn, data) {
        return super.insert(conn, data);
    }

    // UPDATE by id + jadwal_seleksi_id (ANTI IDOR)
    static async update(conn, id, seleksi_id, data) {
        const update = buildUpdate(data, this.columns, {
            alias: 'ps'
        });
        if (!update) return 0;

        try {
            const [result] = await conn.query(
                `
                UPDATE pengawas_seleksis ps
                INNER JOIN jadwal_seleksis js ON js.id = ps.jadwal_seleksi_id
                SET ${update.setClause}
                WHERE ps.id = ?
                AND js.seleksi_id = ?
                `,
                [...update.values, id, seleksi_id]
            );

            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
    }

    // DELETE by id + jadwal_seleksi_id (ANTI IDOR)
    static async deleteByKey(conn, field, value) {
        return super.deleteByKey(conn,field,value);
    }

    // DELETE by id + jadwal_seleksi_id (ANTI IDOR)
    static async deleteById(conn, id, seleksi_id) {
        try {
            const [result] = await conn.query(
                `DELETE ps
                FROM pengawas_seleksis ps
                INNER JOIN jadwal_seleksis js ON js.id = ps.jadwal_seleksi_id
                WHERE ps.id = ?
                AND js.seleksi_id = ?`,
                [id,seleksi_id]
            );

            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }    
    }
}

module.exports = PengawasSeleksiModel;
