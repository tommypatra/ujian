// app/models/MapingSoalPesertaModel.js
const BaseModel = require('./BaseModel');

class MapingSoalPesertaModel extends BaseModel {

    static tableName  = 'maping_soal_pesertas';
    static tableAlias = 'msp';

    static selectFields = `
        msp.id,
        msp.peserta_seleksi_id,
        msp.bank_soal_id,
        msp.created_at,
        msp.updated_at,
        b.jenis_soal_id,
        b.domain_soal_id,
        b.tahun,
        b.pembuat_user_id,
        b.pertanyaan,
        b.bobot,
        b.is_aktif,
        ds.kode AS kode_domain,
        ds.domain,
        js.kode AS kode_soal,
        js.jenis
    `;

    static joinTables = `
        LEFT JOIN bank_soals  b  ON b.id = msp.bank_soal_id
        LEFT JOIN jenis_soals js ON js.id = b.jenis_soal_id
        LEFT JOIN domain_soals ds ON ds.id = b.domain_soal_id
    `;

    static countColumns = 'COUNT(DISTINCT msp.id)';

    static orderBy = `
        ORDER BY msp.id ASC`;

    static columns = [
        'peserta_seleksi_id',
        'bank_soal_id'
    ];

    static allowedFields = [];

    /**
     * shortcut domain-specific
     */
    static async findById(conn, id) {
        return this.findAll(
            conn,
            'WHERE msp.id = ?',
            [id],
            0 // tanpa paging
        );
    }

    /**
     * shortcut domain-specific
     */
    static async findAllByPesertaSeleksiId(conn, peserta_seleksi_id) {
        return this.findAll(conn, 'WHERE msp.peserta_seleksi_id = ?', [peserta_seleksi_id], 0);
    }

    /**
     * Insert baru
     */
    static async insert(conn, data) {
        return super.insert(conn, data);
    }

    static async insertIgnore(conn, data) {
        const query = `
            INSERT IGNORE INTO maping_soal_pesertas
            (peserta_seleksi_id, bank_soal_id, created_at)
            VALUES (?, ?, NOW())
        `;
        const params = [data.peserta_seleksi_id, data.bank_soal_id];

        // console.log('[SQL]', query);
        // console.log('[PARAMS]', params);

        await conn.query(query, params);
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

    static async findRandomByDomain(conn, peserta_id, seleksi_id, domain_soal_id, limit) {
        const query = `
            SELECT b.id, b.domain_soal_id, b.bobot, js.kode as kode_jenis, js.jenis
            FROM soal_seleksis ss 
            INNER JOIN bank_soals b ON b.id = ss.bank_soal_id
            INNER JOIN jenis_soals js ON js.id = b.jenis_soal_id
            WHERE ss.seleksi_id = ?
            AND b.domain_soal_id = ?
            AND b.is_aktif = 1
            AND NOT EXISTS (
                SELECT 1
                FROM maping_soal_pesertas msp
                WHERE msp.peserta_seleksi_id = ?
                AND msp.bank_soal_id = b.id
            )
            ORDER BY RAND()
            LIMIT ?
        `;
        const params = [seleksi_id, domain_soal_id, peserta_id, limit];

        // console.log('[SQL]', query);
        // console.log('[PARAMS]', params);

        const [rows] = await conn.query(query, params);
        return rows;
    }


    static async countSoalPesertaByDomain(conn, pesertaId, domainSoalId) {
        const [[row]] = await conn.query(
            `
            SELECT COUNT(*) AS total
            FROM maping_soal_pesertas msp
            JOIN bank_soals b ON b.id = msp.bank_soal_id
            WHERE msp.peserta_seleksi_id = ?
            AND b.domain_soal_id = ?
            `,
            [pesertaId, domainSoalId]
        );
        return row.total;
    }

    static async generatePilihanOrder(conn, bank_soal_id) {
        const [rows] = await conn.query(
            `
            SELECT id
            FROM bank_soal_pilihans
            WHERE bank_soal_id = ?
            ORDER BY RAND()
            `,
            [bank_soal_id]
        );

        // return array of ID pilihan
        return rows.map(r => r.id);
    }


    static async generatePilihanPeserta(conn, peserta_seleksi_id, bank_soal_id) {
        const [pilihan] = await conn.query(
            `
            SELECT id,bank_soal_id
            FROM bank_soal_pilihans
            WHERE bank_soal_id = ?
            ORDER BY RAND()
            `,
            [bank_soal_id]
        );

        for (const p of pilihan) {
            await conn.query(
                `
                INSERT IGNORE INTO maping_pilihan_pesertas
                (peserta_seleksi_id, bank_soal_id, bank_soal_pilihan_id, created_at)
                VALUES (?, ?, ?, NOW())
                `,
                [peserta_seleksi_id, p.bank_soal_id, p.id]
            );
        }
    }

    static async updatePilihanOrder(conn, peserta_seleksi_id, bank_soal_id, pilihan_order) {
        const query = `
            UPDATE maping_soal_pesertas
            SET pilihan_order = ?, updated_at = NOW()
            WHERE peserta_seleksi_id = ?
            AND bank_soal_id = ?
        `;

        const params = [
            pilihan_order,
            peserta_seleksi_id,
            bank_soal_id
        ];

        await conn.query(query, params);
    }

}

module.exports = MapingSoalPesertaModel;
