// app/models/PesertaSeleksiModel.js
const { buildInsert, buildUpdate } = require('../helpers/sqlHelper');

class PesertaSeleksiModel {
    //setup tabel
    static tableName = `peserta_seleksis`;
    static tableAlias = `ps`;
    static selectFields = `
    ps.id, ps.peserta_id, ps.jadwal_seleksi_id, ps.is_login,ps.login_foto, ps.login_at,
    ps.is_allow,ps.allow_at, ps.created_at, ps.updated_at,
    p.seleksi_id, p.jenis_kelamin, p.hp, p.email, p.nama, p.nomor_peserta, p.foto, p.user_name, p.tanggal_lahir,
    s.nama as seleksi_nama, s.waktu_mulai, s.waktu_selesai, s.prefix_app, s.tahun, s.keterangan,
    js.sesi, js.tanggal, js.lokasi_ujian, js.jam_mulai, js.jam_selesai
    `;
    static joinTables = `
        LEFT JOIN pesertas p ON p.id = ps.peserta_id
        LEFT JOIN jadwal_seleksis js ON js.id = ps.jadwal_seleksi_id
        LEFT JOIN seleksis s ON s.id = p.seleksi_id
    `;
    static countColumns = `COUNT(ps.id)`;
    static orderBy = `ORDER BY s.tahun DESC, s.waktu_mulai DESC, js.sesi, CAST(p.nomor_peserta AS UNSIGNED) ASC, p.nama ASC`;

    static columns = [
        'peserta_id',
        'jadwal_seleksi_id',
        'is_login',
        'login_foto',
        'login_at',
        'is_allow',
        'allow_at'
    ];

    /**
     * helper internal pencarian berdasarkan field dan value
     */
    static async findByKey(conn, field, value) {
        const allowedFields = ['ps.id'];

        if (!allowedFields.includes(field)) {
            throw new Error('Field tidak diizinkan');
        }

        const [[row]] = await conn.query(
            `SELECT ${this.selectFields} FROM ${this.tableName} ${this.tableAlias} ${this.joinTables}            
            WHERE ${field} = ?`,
            [value]
        );

        return row || null;
    }

    /**
     * cari berdasarkan id
     */
    static async findById(conn, id) {
        return this.findByKey(conn, 'ps.id', id);
    }

    /**
     * cari isValidPesertaSeleksi berdasarkan user dan seleksi id
     */
    static async isValidPesertaSeleksi(conn, peserta_id, seleksi_id) {
        const [[row]] = await conn.query(
            `SELECT id FROM pesertas WHERE id = ? AND seleksi_id = ? LIMIT 1`,
            [peserta_id, seleksi_id]
        );

        return !!row;
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

module.exports = PesertaSeleksiModel;