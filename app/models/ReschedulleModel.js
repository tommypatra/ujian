// app/models/ReschedulleModel.js
const { buildInsert, buildUpdate } = require('../helpers/sqlHelper');

class ReschedulleModel {
    //setup tabel
    static tableName = `reschedulles`;
    static tableAlias = `rs`;
    static selectFields = `
    rs.id, rs.peserta_seleksi_id, rs.alasan, rs.dokumen_pendukung, rs.status, rs.verified_user_id, rs.verified_at, 
    rs.catatan_verifikasi, rs.created_at, rs.updated_at,
    u.name as verified_user_name, u.email as verified_email,
    ps.peserta_id, ps.jadwal_seleksi_id, ps.is_login,ps.login_foto, ps.login_at, ps.is_done, ps.is_allow,ps.allow_at, 
    p.seleksi_id, p.jenis_kelamin, p.hp, p.email, p.nama, p.nomor_peserta, p.foto, p.user_name, p.tanggal_lahir,
    s.nama as seleksi_nama, s.waktu_mulai, s.waktu_selesai, s.prefix_app, s.tahun, s.keterangan,
    js.sesi, js.tanggal, js.lokasi_ujian, js.jam_mulai, js.jam_selesai
    `;
    static joinTables = `
        LEFT JOIN peserta_seleksis ps ON ps.id = rs.peserta_seleksi_id
        LEFT JOIN pesertas p ON p.id = ps.peserta_id
        LEFT JOIN jadwal_seleksis js ON js.id = ps.jadwal_seleksi_id
        LEFT JOIN users u ON u.id = rs.verified_user_id
        LEFT JOIN seleksis s ON s.id = p.seleksi_id
    `;
    static countColumns = `COUNT(rs.id)`;
    static orderBy = `ORDER BY rs.updated_at, rs.created_at ASC`;

    static columns = [
        'peserta_seleksi_id',
        'alasan',
        'dokumen_pendukung',
        'status',
    ];

    static validasi_kolom = [
        'peserta_seleksi_id',
        'status',
        'verified_user_id',
        'verified_at',
        'catatan_verifikasi',
    ];
    /**
     * helper internal pencarian berdasarkan field dan value
     */
    static async findByKey(conn, field, value, user) {
        const allowedFields = ['rs.id'];

        if (!allowedFields.includes(field)) {
            throw new Error('Field tidak diizinkan');
        }

        const [[row]] = await conn.query(
            `SELECT ${this.selectFields} FROM ${this.tableName} ${this.tableAlias} ${this.joinTables}            
            WHERE ${field} = ? AND p.id = ?`,
            [value,user.id]
        );

        return row || null;
    }

    /**
     * cari berdasarkan id
     */
    static async findById(conn, id, user) {
        return this.findByKey(conn, 'rs.id', id, user);
    }

    /**
     * Ambil data (paged)
     */
    static async findAll(conn, whereSql = '', params = [], limit = 10, offset = 0) {
        const [rows] = await conn.query(
            `SELECT ${this.selectFields} FROM ${this.tableName} ${this.tableAlias} ${this.joinTables}            
            ${whereSql}
            ${this.orderBy} LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        return rows;
    }

    /**
     * Hitung total (untuk pagination)
     */
    static async countAll(conn, whereSql = '', params = []) {
        const [[row]] = await conn.query(
            `SELECT ${this.countColumns} AS total FROM ${this.tableName} ${this.tableAlias} ${this.joinTables}
            ${whereSql}`,
            params
        );

        return row.total;
    }

    /**
     * Insert baru
     */
    static async insert(conn, data) {
        const insert = buildInsert(data, this.columns);

        const [result] = await conn.query(`
            INSERT INTO ${this.tableName} (${insert.columns})
            VALUES (${insert.placeholders})
            `,
            insert.values
        );

        return result.insertId;
    }

    /**
     * Update data
     */
    static async update(conn, id, data) {
        const update = buildUpdate(data, this.columns);
        if (!update) return 0;

        update.values.push(id);

        const [result] = await conn.query(`UPDATE ${this.tableName}
            SET ${update.setClause} WHERE id = ?`,
            update.values
        );

        return result.affectedRows;
    }

    /**
     * Delete data
     */
    static async deleteById(conn, id) {
        const [result] = await conn.query(
            `
            DELETE FROM ${this.tableName}
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = ReschedulleModel;