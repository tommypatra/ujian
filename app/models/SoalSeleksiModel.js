// app/models/SoalSeleksiModel.js
const BaseModel = require('./BaseModel');

class SoalSeleksiModel extends BaseModel {

    static tableName  = 'soal_seleksis';
    static tableAlias = 'ss';

    static selectFields = `
        ss.id,
        ss.seleksi_id,
        b.id AS bank_soal_id,
        b.jenis_soal_id,
        b.domain_soal_id,
        b.tahun,
        b.pembuat_user_id,
        b.pertanyaan,
        b.bobot,
        b.is_aktif,
        b.created_at,
        b.updated_at,

        u.name,
        u.email,

        ds.kode AS kode_domain,
        ds.domain,

        js.kode AS kode_soal,
        js.jenis
    `;

    static joinTables = `
        LEFT JOIN bank_soals  b  ON b.id = ss.bank_soal_id
        LEFT JOIN users       u  ON u.id = b.pembuat_user_id
        LEFT JOIN jenis_soals js ON js.id = b.jenis_soal_id
        LEFT JOIN domain_soals ds ON ds.id = b.domain_soal_id
    `;

    static countColumns = 'COUNT(DISTINCT ss.id)';

    static orderBy = `
        ORDER BY
            b.tahun DESC,
            b.domain_soal_id ASC,
            b.jenis_soal_id ASC,
            b.created_at DESC
    `;

    static columns = [
        'bank_soal_id',
        'seleksi_id'
    ];

    static allowedFields = [
        'ss.id',
        'ss.seleksi_id',
        'ss.bank_soal_id',
        'b.id'
    ];

    static async countBankSoalAvailable(conn, seleksi_id, domain_soal_id) {
        const sql = `
            SELECT COUNT(*) as total
            FROM bank_soals b
            LEFT JOIN soal_seleksis ss 
                ON ss.bank_soal_id = b.id
                AND ss.seleksi_id = ?
            WHERE 
                b.domain_soal_id = ?
                AND ss.id IS NULL
                AND b.is_aktif = 1
        `;

        const [[row]] = await conn.query(sql, [seleksi_id, domain_soal_id]);
        return row.total;
    }


    static async findBankSoalAvailable(conn, seleksi_id, domain_soal_id, limit = 0, offset = 0) {
        let sql = `
            SELECT 
                b.id,
                b.jenis_soal_id,
                b.domain_soal_id,
                b.tahun,
                b.pembuat_user_id,
                b.pertanyaan,
                b.bobot,
                b.is_aktif,
                b.created_at,
                b.updated_at,
                u.name, u.email,
                js.kode as kode_jenis,
                js.jenis
            FROM bank_soals b
            LEFT JOIN soal_seleksis ss ON ss.bank_soal_id = b.id AND ss.seleksi_id = ?
            LEFT JOIN users u ON u.id = b.pembuat_user_id
            LEFT JOIN jenis_soals js ON js.id = b.jenis                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     _soal_id
            WHERE 
                b.domain_soal_id = ?
                AND ss.id IS NULL
                AND b.is_aktif = 1
            ORDER BY b.tahun DESC, b.created_at DESC
        `;

        const params = [seleksi_id, domain_soal_id];

        if (limit > 0) {
            sql += ` LIMIT ? OFFSET ?`;
            params.push(limit, offset);
        }

        const [rows] = await conn.query(sql, params);
        return rows;
    }

    static async bulkInsert(seleksi_id, bank_soal_ids) {
        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();

            const [rows] = await conn.query(
                `SELECT id, domain_soal_id 
                FROM bank_soals 
                WHERE id IN (?)`,
                [bank_soal_ids]
            );

            const values = bank_soal_ids.map(id => [id, seleksi_id]);

            await conn.query(
                `INSERT INTO soal_seleksis 
                (bank_soal_id, seleksi_id, created_at)
                VALUES ?`,
                [values.map(v => [...v, new Date()])]
            );

            await conn.commit();
            return true;

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Bulk delete by seleksi_id + array id
     */
    static async bulkDeleteBySeleksi(conn, seleksi_id, ids = []) {
        if (!Array.isArray(ids) || ids.length === 0) {
            return 0;
        }

        const placeholders = ids.map(() => '?').join(',');

        const [result] = await conn.query(
            `
            DELETE FROM ${this.tableName}
            WHERE seleksi_id = ?
            AND id IN (${placeholders})
            `,
            [seleksi_id, ...ids]
        );

        return result.affectedRows;
    }


    static async cekDomainSoalId(conn, seleksi_id, bank_soal_id) {
        const [[row]] = await conn.query(
            `
            SELECT 1
            FROM jumlah_soals js
            INNER JOIN bank_soals bs ON bs.domain_soal_id = js.domain_soal_id
            WHERE 
            js.seleksi_id = ?
            AND js.jumlah > 0 
            AND bs.id = ?
            LIMIT 1
            `,
            [seleksi_id, bank_soal_id]
        );

        return !!row; // true / false
    }


    /**
     * shortcut domain-specific
     */
    static async findById(conn, id) {
        return this.findAll(
            conn,
            'WHERE ss.id = ?',
            [id],
            0 // tanpa paging
        );
    }

    static async findAllBySeleksiId(conn, seleksiId) {
        return this.findAll(conn, 'WHERE ss.seleksi_id = ?', [seleksiId], 0);
    }

    /**
     * Insert baru
     */
    static async insert(conn, data) {
        return super.insert(conn, data);
    }

    /**
     * Update data
     */
    static async update(conn, id, data) {
        return super.updateByKey(conn, 'id', id, data);
    }

    /**
     * Delete data
     */
    static async deleteById(conn, id) {
        return super.deleteByKey(conn, 'id', id);
    }

}

module.exports = SoalSeleksiModel;
