// app/models/BankSoalPilihanModel.js
const BaseModel = require('./BaseModel');
const { buildUpdate } = require('../helpers/sqlHelper');
const { mapDbError } = require('../helpers/dbErrorHelper');

class BankSoalPilihanModel extends BaseModel {

    /* =======================
     * CONFIG
     * ======================= */
    static tableName = 'bank_soal_pilihans';
    static tableAlias = 'bsp';

    static selectFields = `
        bsp.id, bsp.bank_soal_id, bsp.pilihan, bsp.is_benar, bsp.created_at, bsp.updated_at,
        b.pembuat_user_id,
        b.pertanyaan, b.bobot, b.is_aktif, 
        u.name, u.email,
        ds.kode AS kode_domain, ds.domain,
        js.kode AS kode_soal, js.jenis
    `;

    static joinTables = `
        LEFT JOIN bank_soals b ON bsp.bank_soal_id = b.id
        LEFT JOIN users u ON u.id = b.pembuat_user_id
        LEFT JOIN jenis_soals js ON js.id = b.jenis_soal_id
        LEFT JOIN domain_soals ds ON ds.id = b.domain_soal_id
    `;

    static orderBy = `
        ORDER BY
            b.pertanyaan DESC,
            bsp.pilihan ASC
    `;

    static countColumns = `COUNT(DISTINCT bsp.id)`;

    static columns = [
        'bank_soal_id',
        'pilihan',
        'is_benar',
    ];

    static allowedFields = [
        'bsp.bank_soal_id',
        'bsp.id',
    ];

    static async findAllBySoalId(conn, bank_soal_id) {
        return super.findAllByKey(conn, 'bsp.bank_soal_id', [bank_soal_id]);
    }

    static async findById(conn, id) {
        return super.findByKey(conn, 'bsp.id', id);
    }

    static async insert(conn, data) {
        return super.insert(conn, data);
    }

    /**
     * UPDATE (ANTI IDOR)
     */
    static async update(conn, id, user_id, bank_soal_id,  data) {
        const update = buildUpdate(data, this.columns, { alias: 'bsp' });
        if (!update) return 0;

        try {
            const [result] = await conn.query(`
                UPDATE bank_soal_pilihans bsp
                INNER JOIN bank_soals bs ON bs.id = bsp.bank_soal_id
                SET ${update.setClause}
                WHERE bsp.id = ?
                    AND bsp.bank_soal_id = ?
                    AND bs.pembuat_user_id = ?
                `,
                [...update.values, id, bank_soal_id, user_id]
            );

            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
    }

    static async deleteById(conn, id, user_id, bank_soal_id) {
        try {
            const [result] = await conn.query(
            `
            DELETE bsp
            FROM bank_soal_pilihans bsp
            INNER JOIN bank_soals bs ON bs.id = bsp.bank_soal_id
            WHERE 
                bsp.id = ? AND 
                bsp.bank_soal_id = ? AND 
                bs.pembuat_user_id = ?
            `,
            [id, bank_soal_id, user_id]
            );

            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
    }


    static async deleteBySoalId(conn, user_id, bank_soal_id) {
        try {
            const [result] = await conn.query(
            `
            DELETE bsp
            FROM bank_soal_pilihans bsp
            INNER JOIN bank_soals bs ON bs.id = bsp.bank_soal_id
            WHERE 
                bsp.bank_soal_id = ? AND 
                bs.pembuat_user_id = ?
            `,
            [bank_soal_id, user_id]
            );

            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
    }
}

module.exports = BankSoalPilihanModel;
