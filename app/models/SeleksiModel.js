// app/models/SeleksiModel.js

class SeleksiModel {
    //setup tabel
    static tableName = `seleksis`;
    static tableAlias = ``;
    static selectFields = `id,nama, waktu_mulai, waktu_selesai, prefix_nomor_peserta, prefix_login, keterangan ,created_at,updated_at`;
    static joinTables = ``;
    static countColumns = `COUNT(*)`;
    static orderBy = `ORDER BY waktu_mulai DESC, nama ASC`;
    static insertColumns = `nama, waktu_mulai, waktu_selesai, prefix_nomor_peserta, prefix_login, keterangan, created_at`;
    static insertValues  = `?, ?`;
    /**
     * helper internal pencarian berdasarkan field dan value
     */
    static async findByKey(conn, field, value) {
        const allowedFields = ['id'];

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
        return this.findByKey(conn, 'id', id);
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
        const [result] = await conn.query(
            `
            INSERT INTO ${this.tableName} (${this.insertColumns})
            VALUES (${this.insertValues})
            `,
            [
                data.nama,
                data.waktu_mulai,
                data.waktu_selesai,
                data.prefix_nomor_peserta,
                data.prefix_login,
                data.keterangan,
                data.created_at
            ]
        );

        return result.insertId;
    }

    /**
     * Update data
     */
    static async update(conn, id, data) {
        const fields = [];
        const values = [];


        if (data.nama !== undefined) {
            fields.push('nama = ?');
            values.push(data.nama);
        }

        if (data.waktu_mulai !== undefined) {
            fields.push('waktu_mulai = ?');
            values.push(data.waktu_mulai);
        }

        if (data.waktu_selesai !== undefined) {
            fields.push('waktu_selesai = ?');
            values.push(data.waktu_selesai);
        }

        if (data.prefix_login !== undefined) {
            fields.push('prefix_login = ?');
            values.push(data.prefix_login);
        }

        if (data.prefix_nomor_peserta !== undefined) {
            fields.push('prefix_nomor_peserta = ?');
            values.push(data.prefix_nomor_peserta);
        }

        if (data.keterangan !== undefined) {
            fields.push('keterangan = ?');
            values.push(data.keterangan);
        }

        if (fields.length === 0) {
            return 0; // tidak ada yang diupdate
        }

        fields.push('updated_at = ?');
        values.push(new Date());

        values.push(id);

        const [result] = await conn.query(
            `
            UPDATE ${this.tableName}
            SET ${fields.join(', ')}
            WHERE id = ?
            `,
            values
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

module.exports = SeleksiModel;