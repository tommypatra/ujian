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
        u.name as nama, 
        u.email,
        'pengawas' as role,
        u.email as user_name,
        ps.created_at,
        ps.updated_at,
        js.seleksi_id,
        js.sesi,
        js.tanggal,
        js.lokasi_ujian,
        js.jam_mulai,
        js.jam_selesai,
        js.is_mulai,
        js.is_selesai,

        js.status,
        s.nama AS seleksi_nama,
        s.prefix_app,
        s.tahun,
        s.keterangan AS seleksi_keterangan
    `;

    static joinTables = `
        LEFT JOIN jadwal_seleksis js ON js.id = ps.jadwal_seleksi_id
        LEFT JOIN seleksis s ON s.id = js.seleksi_id
        LEFT JOIN users u ON u.id = ps.user_id
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
            u.name ASC
    `;

    static columns = [
        'jadwal_seleksi_id',
        'user_id',
    ];

    static allowedFields = [
        'ps.id',
        'js.id',
        'js.sesi'
    ];

    /* =======================
     * READ
     * ======================= */

    static async findById(conn, id, options = {}) {
        return super.findByKey(conn, 'ps.id', id, options);
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

    
    static async detailPengawas(conn, jadwal_seleksi_id) {
        // console.log(pengawas_user_id, jadwal_seleksi_id);
        const [[row]] = await conn.query(
            `
            SELECT ps.id as pengawas_seleksi_id, 
                    js.is_selesai,
                    js.is_mulai,
                    js.seleksi_id, js.sesi, js.tanggal, js.lokasi_ujian, js.jam_mulai, js.jam_selesai, js.status,
                    u.name as nama, u.email, u.id as user_id                    
            FROM pengawas_seleksis ps
            LEFT JOIN jadwal_seleksis js ON js.id=ps.jadwal_seleksi_id
            LEFT JOIN users u ON u.id = ps.user_id
            WHERE ps.jadwal_seleksi_id = ?
            LIMIT 1
            `,
            [jadwal_seleksi_id]
        );

        return row || null;
    }

    /**
     * Cari peserta berdasarkan username + seleksi
     * (lebih aman daripada username saja)
     */
    static async findByUserName(conn, user_name, seleksi_id) {
        const [[row]] = await conn.query(
            `
            SELECT ${this.selectFields},ps.password
            FROM ${this.tableName} ${this.tableAlias}
            ${this.joinTables}
            WHERE ps.user_name = ?
              AND js.seleksi_id = ?
            LIMIT 1
            `,
            [user_name, seleksi_id]
        );

        return row || null;
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

    
    // UPDATE validasiPeserta (ANTI IDOR)
    static async validasiPeserta(conn, peserta_seleksi_id, pengawas_id, data) {
        try {
            const query = `
                UPDATE peserta_seleksis ps
                LEFT JOIN pesertas p ON p.id = ps.peserta_id
                LEFT JOIN pengawas_seleksis ss ON ss.jadwal_seleksi_id = ps.jadwal_seleksi_id
                SET ps.is_allow=?,ps.is_enter=?, ps.allow_at=NOW(), ps.updated_at=NOW()
                WHERE 
                    ps.id = ? AND 
                    ss.user_id = ? AND 
                    p.is_login = 1 AND ps.is_enter = 1
            `;

            const params = [data.is_allow, data.is_enter, peserta_seleksi_id, pengawas_id];

            // console.log('[SQL]', query);
            // console.log('[PARAMS]', params);

            const [result] = await conn.query(query, params);

            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
    }


    // UPDATE resetLogin (ANTI IDOR)
                    // p.device_id = NULL,
                    // ps.is_enter = 0,
                    // ps.enter_foto = NULL,
                    // ps.is_allow = 0,

    static async resetLogin(conn, peserta_seleksi_id, user_id) {
        try {
            const [result] = await conn.query(
                `
                UPDATE pesertas p
                INNER JOIN peserta_seleksis ps ON ps.peserta_id = p.id
                INNER JOIN pengawas_seleksis ss ON ss.jadwal_seleksi_id = ps.jadwal_seleksi_id
                SET 
                    p.is_login = 0,

                    p.device_id = NULL,
                    ps.is_enter = 0,
                    ps.media_path_id = NULL,
                    ps.is_allow = 0,

                    p.token_login = NULL,
                    p.updated_at = NOW(),
                    ps.updated_at = NOW()
                WHERE ps.id = ? AND ss.user_id = ?
                `,
                [peserta_seleksi_id, user_id]
            );
            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
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

    static async                                                                                                                                                                                                                findJadwalPengawas(conn, seleksi_id, user_id) {
        const [rows] = await conn.query(
            `SELECT 
                js.id as jadwal_seleksi_id, 
                js.sesi, js.tanggal, js.lokasi_ujian, js.jam_mulai, js.jam_selesai, js.status,
                ps.id as pengawas_seleksi_id,
                js.is_mulai,
                js.is_selesai,
                js.seleksi_id,
                COUNT(pes.id) as jumlah_peserta
            FROM jadwal_seleksis js
            INNER JOIN pengawas_seleksis ps ON ps.jadwal_seleksi_id = js.id
            LEFT JOIN peserta_seleksis pes ON pes.jadwal_seleksi_id = js.id            
            WHERE 
                js.seleksi_id = ? AND ps.user_id = ?
            GROUP BY js.id            
            ORDER BY js.sesi ASC, js.tanggal ASC`,
            [seleksi_id, user_id]
        );
        return rows;
    }

    static async findPengawasBySeleksi(conn, seleksi_id) {
        const [rows] = await conn.query(
            `SELECT ps.id, ps.user_id
             FROM pengelola_seleksis ps
             WHERE ps.seleksi_id = ?
             AND ps.jabatan = 'pengawas'
             ORDER BY ps.id ASC`,
            [seleksi_id]
        );
        return rows;
    }

    static async countPengawas(conn, seleksi_id) {
        const [[row]] = await conn.query(
            `SELECT COUNT(*) AS total
             FROM pengelola_seleksis
             WHERE seleksi_id = ?
             AND jabatan = 'pengawas'`,
            [seleksi_id]
        );
        return row.total;
    }    
}

module.exports = PengawasSeleksiModel;
