// app/models/PesertaModel.js
const { buildInsert, buildUpdate } = require('../helpers/sqlHelper');

class PesertaModel {
    //setup tabel
    static tableName = `pesertas`;
    static tableAlias = `p`;
    static selectFields = `
    p.id, p.seleksi_id, p.jenis_kelamin, p.hp, p.email, p.nama, p.nomor_peserta, p.foto, p.user_name,p.tanggal_lahir,
    p.created_at,p.updated_at,
    s.nama as seleksi_nama, s.waktu_mulai, s.waktu_selesai, s.prefix_app, s.tahun, s.keterangan 
    `;
    static joinTables = `
        LEFT JOIN seleksis s ON s.id = p.seleksi_id
    `;
    static countColumns = `COUNT(p.id)`;
    static orderBy = `ORDER BY s.tahun DESC, s.waktu_mulai DESC, CAST(p.nomor_peserta AS UNSIGNED) ASC, p.nama ASC`;

    static columns = [
        'nomor_peserta',
        'seleksi_id',
        'nama',
        'user_name',
        'password',
        'jenis_kelamin',
        'tanggal_lahir',
        'hp',
        'email',
        'foto'
    ];

    /**
     * helper internal pencarian berdasarkan field dan value
     */
    static async findByKey(conn, field, value) {
        const allowedFields = ['p.id'];

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
        return this.findByKey(conn, 'p.id', id);
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

module.exports = PesertaModel;