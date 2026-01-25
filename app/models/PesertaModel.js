// app/models/PesertaModel.js
const BaseModel = require('./BaseModel');

class PesertaModel extends BaseModel {

    /* =======================
     * TABLE CONFIG
     * ======================= */
    static tableName = 'pesertas';
    static tableAlias = 'p';

    static selectFields = `
        p.id,
        p.seleksi_id,
        p.jenis_kelamin,
        p.hp,
        p.email,
        'peserta' as role,
        p.nama,
        p.nomor_peserta,
        p.foto,
        p.is_login,
        p.user_name,
        p.tanggal_lahir,
        p.created_at,
        p.updated_at,
        s.nama AS seleksi_nama,
        s.waktu_mulai,
        s.waktu_selesai,
        s.prefix_app,
        s.tahun,
        s.keterangan
    `;

    static joinTables = `
        LEFT JOIN seleksis s ON s.id = p.seleksi_id
    `;

    static countColumns = 'COUNT(p.id)';

    static orderBy = `
        ORDER BY
            s.tahun DESC,
            s.waktu_mulai DESC,
            CAST(p.nomor_peserta AS UNSIGNED) ASC,
            p.nama ASC
    `;

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

    static allowedFields = [
        'p.id',
        'p.user_name'
    ];

    /* =======================
     * READ
     * ======================= */

    static async findById(conn, id) {
        return super.findByKey(conn, 'p.id', id);
    }

    /**
     * Cari peserta berdasarkan username + seleksi
     * (lebih aman daripada username saja)
     */
    static async findByUserName(conn, user_name, seleksi_id) {
        const [[row]] = await conn.query(
            `
            SELECT ${this.selectFields},p.password
            FROM ${this.tableName} ${this.tableAlias}
            ${this.joinTables}
            WHERE p.user_name = ?
              AND p.seleksi_id = ?
            LIMIT 1
            `,
            [user_name, seleksi_id]
        );

        return row || null;
    }

    static async findAll(conn, whereSql = '', params = [], limit = 10, offset = 0) {
        return super.findAll(conn, whereSql, params, limit, offset);
    }

    static async countAll(conn, whereSql = '', params = []) {
        return super.countAll(conn, whereSql, params);
    }

    /* =======================
     * WRITE (AMAN)
     * ======================= */

    // INSERT (seleksi_id HARUS dari service / URL)
    static async insert(conn, data) {
        return super.insert(conn, data);
    }

    // UPDATE by id + seleksi_id (ANTI SALAH SELEKSI)
    static async updateByKeys(conn, id, seleksi_id, data) {
        return super.updateByKeys(
            conn,
            ['id', 'seleksi_id'],
            [id, seleksi_id],
            data
        );
    }

    // DELETE by id + seleksi_id (ANTI SALAH HAPUS)
    static async deleteByKeys(conn, id, seleksi_id) {
        return super.deleteByKeys(
            conn,
            ['id', 'seleksi_id'],
            [id, seleksi_id]
        );
    }

    static async updateIsLogin(conn, peserta_id) {
        const [result] = await conn.query(
            `
            UPDATE pesertas
            SET is_login = 1,
                login_at = NOW(),
                updated_at = NOW()
            WHERE id = ?
            AND is_login = 0
            `,
            [peserta_id]
        );

        if (result.affectedRows === 0) {
            throw new Error('Akun sedang aktif. Reset akun anda terlebih dahulu pada pengawas ujian');
        }

        return result.affectedRows;
    }

}

module.exports = PesertaModel;
