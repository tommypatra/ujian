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
        bsp.id, bsp.bank_soal_id, bsp.pilihan, bsp.is_benar, bsp.created_at, bsp.updated_at
    `;

    static joinTables = ``;

    static orderBy = `
        ORDER BY
            bsp.bank_soal_id DESC,
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

    static async findAllBySoalId(conn, bank_soal_id, options = {}) {
        return super.findAllByKey(conn, 'bsp.bank_soal_id', [bank_soal_id], options);
    }

    static async findById(conn, id) {
        return super.findByKey(conn, 'bsp.id', id);
    }

    static async insert(conn, data) {
        return super.insert(conn, data);
    }

    static async adaJawbanBenar(conn, bank_soal_id) {
        const [[row]] = await conn.query(
            `
            SELECT 1 AS exist 
            FROM bank_soal_pilihans
            WHERE 
                bank_soal_id = ? AND 
                is_benar = 1
            LIMIT 1`,
            [bank_soal_id]
        );
        return !!row;
    }

    static async adaJawbanBenarSelainIni(conn, id, bank_soal_id) {
        const [[row]] = await conn.query(
            `
            SELECT 1 AS exist
            FROM bank_soal_pilihans
            WHERE bank_soal_id = ? AND is_benar = 1 AND id != ?
            LIMIT 1
            `,
            [bank_soal_id, id]
        );

        return !!row;
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
