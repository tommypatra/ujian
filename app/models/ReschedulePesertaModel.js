const BaseModel = require('./BaseModel');
const { buildUpdate } = require('../helpers/sqlHelper');
const { mapDbError } = require('../helpers/dbErrorHelper');

class ReschedulePesertaModel extends BaseModel {

    /* =======================
     * TABLE CONFIG
     * ======================= */
    static tableName  = 'reschedules';
    static tableAlias = 'rs';

    static selectFields = `
        rs.id,
        rs.peserta_seleksi_id,
        rs.alasan,
        rs.is_kirim,
        rs.media_path_id,
        mp.uuid,
        rs.status,
        rs.catatan_verifikasi,        
        rs.verified_user_id,
        rs.verified_at,
        rs.created_at,
        rs.updated_at,
        ps.peserta_id,
        p.nama,
        p.email,
        p.nomor_peserta,
        p.hp,
        s.nama as nama_seleksi,
        p.seleksi_id,
        reschedule_mulai,
        reschedule_selesai,
        wajib_validasi_foto,
        (
            CASE 
                WHEN CURDATE() BETWEEN s.reschedule_mulai AND s.reschedule_selesai 
                THEN 1 
                ELSE 0 
            END
        ) AS reschedule_aktif        
    `;

    static joinTables = `
        INNER JOIN peserta_seleksis ps ON ps.id = rs.peserta_seleksi_id
        INNER JOIN pesertas p ON p.id = ps.peserta_id
        INNER JOIN seleksis s ON s.id = p.seleksi_id
        INNER JOIN media_paths mp ON mp.id = rs.media_path_id   
    `;

    static countColumns = 'COUNT(rs.id)';
    static orderBy = 'ORDER BY rs.created_at DESC';

    /**
     * Kolom editable oleh PESERTA
     */
    static columns = [
        'peserta_seleksi_id',
        'alasan',
        'peserta_id',
        'media_path_id'
    ];

    static allowedFields = [
        'rs.id',
        'rs.peserta_seleksi_id',
        'ps.peserta_id',
    ];

    /* =======================
     * READ
     * ======================= */

    static async findByIdandPesertaId(conn, id, peserta_id) {
        return super.findAllByMultipleKeys(
            conn,
            ['rs.id', 'ps.peserta_id'],
            [id, peserta_id]
        );
    }

    static async findByIdPesertaSeleksiId(conn, id, peserta_seleksi_id) {
        return super.findAllByMultipleKeys(
            conn,
            ['rs.id','rs.peserta_seleksi_id'],
            [id,peserta_seleksi_id]
        );
    }

    static async findById(conn, id) {
        return super.findByKey(
            conn,'rs.id', id
        );
    }

    static async findAll(conn, whereSql = '', params = [], limit = 10, offset = 0) {
        return super.findAll(conn, whereSql, params, limit, offset);
    }

    static async countAll(conn, whereSql = '', params = []) {
        return super.countAll(conn, whereSql, params);
    }

    static async findActiveByPesertaSeleksi(conn, peserta_seleksi_id) {
        const [rows] = await conn.query(
            `SELECT id, status 
            FROM reschedules 
            WHERE peserta_seleksi_id = ? 
            AND status IN ('proses', 'terima')
            LIMIT 1`,
            [peserta_seleksi_id]
        );

        return rows[0] || null;
    }

    /* =======================
     * WRITE
     * ======================= */

    /**
     * INSERT
     */
    static async insert(conn, data) {
        return super.insert(conn, data);
    }

    /**
     * UPDATE oleh PESERTA (ANTI IDOR)
     */
    static async update(conn, id, peserta_id, data) {
        const update = buildUpdate(data, this.columns, { alias: 'rs' });
        if (!update) return 0;

        // console.log(update)
        // console.log(id,peserta_id)
        try {
            const sql =`UPDATE reschedules rs
                INNER JOIN peserta_seleksis ps ON ps.id = rs.peserta_seleksi_id
                SET ${update.setClause}
                WHERE rs.id = ? AND ps.peserta_id = ?`;
            const [result] = await conn.query(
                sql,[...update.values, id, peserta_id]
            );
            console.log(sql);
            console.log(update.values, id, peserta_id)
            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
    }

    static async cariInfoSeleksi(conn, peserta_seleksi_id) {
        const sql = `SELECT 
                s.wajib_validasi_foto,
                ps.id as peserta_seleksi_id,
                ps.peserta_id,
                s.id as seleksi_id,
                js.id as jadwal_seleksi_id,
                (
                    CASE 
                        WHEN CURDATE() BETWEEN s.reschedule_mulai AND s.reschedule_selesai 
                        THEN 1 
                        ELSE 0 
                    END
                ) AS reschedule_aktif     
            FROM peserta_seleksis ps
                INNER JOIN jadwal_seleksis js ON js.id = ps.jadwal_seleksi_id  
                INNER JOIN seleksis s ON s.id = js.seleksi_id  
            WHERE ps.id = ?`;
        const [[row]] = await conn.query(
            sql,
            [peserta_seleksi_id]
        );
        return row;
    }  


    static async cariMediPath(conn, id, peserta_id) {
        const sql = `SELECT 
                rs.id,
                rs.alasan,
                rs.media_path_id,
                mp.uuid,
                mp.path,
                mp.judul, mp.jenis
            FROM reschedules rs
                INNER JOIN peserta_seleksis ps ON ps.id = rs.peserta_seleksi_id
                INNER JOIN media_paths mp ON mp.id = rs.media_path_id  
            WHERE rs.id = ? and ps.peserta_id = ?`;
        const [[row]] = await conn.query(
            sql,
            [id, peserta_id]
        );
        // console.log(sql,id,peserta_id);
        return row;
    }  

    static async kirim(conn, id, data) {
        const kolomKirim = [...this.columns, 'is_kirim'];
        
        const update = buildUpdate(data, kolomKirim, { alias: 'rs' });
        if (!update) return 0;

        try {
            const [result] = await conn.query(
                `
                UPDATE reschedules rs
                INNER JOIN peserta_seleksis ps ON ps.id = rs.peserta_seleksi_id
                SET ${update.setClause}
                WHERE rs.id = ? AND ps.id = ?
                `,
                [...update.values, id, data.peserta_seleksi_id]
            );

            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
    }

    /**
     * DELETE oleh PESERTA (ANTI IDOR)
     */
    static async delete(conn, id, peserta_seleksi_id) {


        try {
            const result = super.findAllByMultipleKeys(
                conn,
                ['rs.id','rs.peserta_seleksi_id'],
                [id,peserta_seleksi_id]
            );
            return result.affectedRows;
        } catch (err) {
            throw mapDbError(err);
        }
    }

}

module.exports = ReschedulePesertaModel;