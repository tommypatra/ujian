// app/models/JumlahSoalModel.js
const BaseModel = require('./BaseModel');

class JumlahSoalModel extends BaseModel {

    static tableName  = 'jumlah_soals';
    static tableAlias = 'js';

    static selectFields = `
        js.id,
        js.jumlah,
        js.domain_soal_id,
        js.seleksi_id,
        ds.kode AS kode_domain,
        ds.domain,
        s.nama as nama_seleksi, s.tahun
    `;

    static joinTables = `
        LEFT JOIN domain_soals ds ON ds.id = js.domain_soal_id
        LEFT JOIN seleksis s ON s.id = js.seleksi_id
    `;

    static countColumns = 'COUNT(DISTINCT js.id)';

    static orderBy = `
        ORDER BY
            js.seleksi_id DESC,
            js.domain_soal_id ASC`;

    static columns = [
        'domain_soal_id',
        'seleksi_id',
        'jumlah'
    ];

    static allowedFields = [];

    /**
     * shortcut domain-specific
     */
    static async findById(conn, id) {
        return this.findAll(
            conn,
            'WHERE js.id = ?',
            [id],
            0 // tanpa paging
        );
    }

    /**
     * shortcut domain-specific
     */
    static async findAllBySeleksiId(conn, seleksiId) {
        return this.findAll(conn, 'WHERE js.seleksi_id = ?', [seleksiId], 0);
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

module.exports = JumlahSoalModel;
