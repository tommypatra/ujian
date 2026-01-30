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
