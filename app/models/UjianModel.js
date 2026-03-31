const BaseModel = require('./BaseModel');

class UjianModel extends BaseModel {

    static tableName = 'maping_soal_pesertas';
    static tableAlias = 'msp';

    static allowedFields = [
        'id',
        'bank_soal_id',
        'peserta_seleksi_id'
    ];

    static selectFields = `
        msp.id,
        msp.bank_soal_id,
        msp.peserta_seleksi_id
    `;

    static columns = [
        'peserta_seleksi_id',
        'bank_soal_id',
        'bank_soal_pilihan_id',
        'jawaban_text',
        'nilai',
    ];

    static orderBy = 'ORDER BY msp.id ASC';

    // /**
    //  * Ambil bank_soal_id berdasarkan range soal peserta
    //  */
    // static async getSoalByRange(conn, peserta_id, peserta_seleksi_id, start = 1, limit = 20) {
    //     const offset = start - 1;

    //     const [mapping] = await conn.query(
    //         `
    //         SELECT msp.bank_soal_id
    //         FROM maping_soal_pesertas msp
    //         JOIN peserta_seleksis ps ON msp.peserta_seleksi_id = ps.id
    //         WHERE ps.peserta_id = ? AND msp.peserta_seleksi_id = ?
    //         ORDER BY msp.id ASC
    //         LIMIT ? OFFSET ?
    //         `,
    //         [peserta_id, peserta_seleksi_id, limit, offset]
    //     );

    //     if (!mapping.length) {
    //         return { soal: [], pilihan: [] };
    //     }

    //     const soalIds = mapping.map(r => r.bank_soal_id);

    //     const [rows] = await conn.query(
    //         `
    //         SELECT
    //             bs.id AS soal_id,
    //             bs.pertanyaan,
    //             bs.bobot,
    //             bsp.id AS pilihan_id,
    //             bsp.pilihan,
    //             jp.bank_soal_pilihan_id AS jawaban_pilihan_id,
    //             jp.nilai
    //         FROM bank_soals bs
    //         JOIN bank_soal_pilihans bsp ON bsp.bank_soal_id = bs.id
    //         LEFT JOIN jawaban_pesertas jp
    //             ON jp.bank_soal_id = bs.id
    //         AND jp.peserta_seleksi_id = ?
    //         WHERE bs.id IN (?)
    //         ORDER BY
    //             FIELD(bs.id, ${soalIds.join(',')}),
    //             bsp.id ASC
    //         `,
    //         [peserta_seleksi_id, soalIds]
    //     );

    //     const soalMap = {};
    //     const pilihan = [];

    //     for (const r of rows) {
    //         if (!soalMap[r.soal_id]) {
    //             soalMap[r.soal_id] = {
    //                 bank_soal_id: r.soal_id,
    //                 pertanyaan: r.pertanyaan,
    //                 bobot: r.bobot,
    //                 jawaban_peserta: r.jawaban_pilihan_id
    //                     ? {
    //                         pilihan_id: r.jawaban_pilihan_id,
    //                         nilai: r.nilai
    //                     }
    //                     : null
    //             };
    //         }

    //         pilihan.push({
    //             id: r.pilihan_id,
    //             bank_soal_id: r.soal_id,
    //             teks: r.pilihan,
    //             dipilih: r.pilihan_id === r.jawaban_pilihan_id
    //         });
    //     }

    //     return {
    //         soal: Object.values(soalMap),
    //         pilihan
    //     };
    // }


    static async statusPeserta(conn, peserta_id, peserta_seleksi_id){
        const [[row]] = await conn.query(
            `
            SELECT p.is_login, ps.is_enter, ps.is_allow, ps.is_done, js.is_mulai, js.is_selesai
            FROM pesertas p
            INNER JOIN peserta_seleksis ps ON p.id = ps.peserta_id
            INNER JOIN jadwal_seleksis js ON js.id = ps.jadwal_seleksi_id
            WHERE p.id = ? AND ps.id = ?
            LIMIT 1
            `,
            [peserta_id, peserta_seleksi_id]
        );

        return row || null;

    }

    static async statusJawaban(conn, peserta_id, peserta_seleksi_id){
        const [rows] = await conn.query(
            `
            SELECT IF(jp.id IS NOT NULL,1,0) AS status
            FROM maping_soal_pesertas msp
            INNER JOIN peserta_seleksis ps ON ps.id = msp.peserta_seleksi_id
            LEFT JOIN jawaban_pesertas jp 
                ON jp.bank_soal_id = msp.bank_soal_id
            WHERE ps.peserta_id = ? AND msp.peserta_seleksi_id = ?
            ORDER BY msp.id ASC
            `,
            [peserta_id, peserta_seleksi_id]
        );

        return rows.map(r => r.status) || [];

    }

    static async countSoalPeserta(conn, peserta_id, peserta_seleksi_id) {

        const [rows] = await conn.query(
            `
            SELECT COUNT(*) AS total
            FROM maping_soal_pesertas msp
            JOIN peserta_seleksis ps 
                ON ps.id = msp.peserta_seleksi_id
            WHERE ps.peserta_id = ?
            AND msp.peserta_seleksi_id = ?
            `,
            [peserta_id, peserta_seleksi_id]
        );

        return rows[0].total;
    }

    /**
     * Ambil soal peserta berdasarkan range + urutan pilihan terkunci
     */
    static async getSoalByRange(conn, peserta_id, peserta_seleksi_id, start = 1, limit = 20) {
        const offset = start - 1;

        if (limit > 50) limit = 50;

        /**
         * 1. Ambil mapping soal + urutan pilihan
         */
        const [mapping] = await conn.query(
            `
            SELECT
                msp.bank_soal_id,
                msp.pilihan_order
            FROM maping_soal_pesertas msp
            JOIN peserta_seleksis ps ON ps.id = msp.peserta_seleksi_id

            JOIN pesertas p ON p.id = ps.peserta_id
            JOIN jadwal_seleksis js ON js.id = ps.jadwal_seleksi_id
            WHERE ps.peserta_id = ?
            AND ps.id = ?
            AND p.is_login = 1
            AND ps.is_allow = 1
            AND COALESCE(ps.is_done, 0) = 0
            AND js.is_mulai = 1
            AND COALESCE(js.is_selesai, 0) = 0

            ORDER BY msp.id ASC
            LIMIT ? OFFSET ?
            `,
            [peserta_id, peserta_seleksi_id, limit, offset]
        );

        // if (!mapping.length) {
        //     return { soal: [] };
        // }

        if (!mapping.length) {
            throw new Error('Tidak berhak mengakses soal');
        }

        const soalIds = mapping.map(m => m.bank_soal_id);

        /**
         * 2. Ambil detail soal + pilihan + jawaban peserta
         */
        const [rows] = await conn.query(
            `
            SELECT
                bs.id AS soal_id,
                bs.pertanyaan,
                bs.bobot,
                bsp.id AS pilihan_id,
                bsp.pilihan,
                jp.bank_soal_pilihan_id AS jawaban_pilihan_id,
                jp.nilai
            FROM bank_soals bs
            JOIN bank_soal_pilihans bsp ON bsp.bank_soal_id = bs.id
            LEFT JOIN jawaban_pesertas jp
                ON jp.bank_soal_id = bs.id
            AND jp.peserta_seleksi_id = ?
            WHERE bs.id IN (?)
            `,
            [peserta_seleksi_id, soalIds]
        );

        /**
         * 3. Susun soal + pilihan (belum diurutkan)
         */
        const soalMap = {};

        for (const r of rows) {
            if (!soalMap[r.soal_id]) {
                soalMap[r.soal_id] = {
                    bank_soal_id: r.soal_id,
                    pertanyaan: r.pertanyaan,
                    bobot: r.bobot,
                    jawaban_peserta: r.jawaban_pilihan_id
                        ? {
                            pilihan_id: r.jawaban_pilihan_id,
                            nilai: r.nilai
                        }
                        : null,
                    pilihan: []
                };
            }

            soalMap[r.soal_id].pilihan.push({
                id: r.pilihan_id,
                teks: r.pilihan,
                dipilih: r.pilihan_id === r.jawaban_pilihan_id
            });
        }

        /**
         * 4. Terapkan urutan pilihan dari mapping (PALING PENTING)
         */
        for (const m of mapping) {
            const soal = soalMap[m.bank_soal_id];
            if (!soal || !m.pilihan_order) continue;

            const urutan = JSON.parse(m.pilihan_order);

            soal.pilihan = urutan
                .map(id => soal.pilihan.find(p => p.id === id))
                .filter(Boolean);
        }

        /**
         * 5. Return sesuai urutan soal mapping
         */
        return {
            soal: mapping
                .map(m => soalMap[m.bank_soal_id])
                .filter(Boolean)
        };
    }

    static async cekPilihanSoal(conn,bank_soal_id,bank_soal_pilihan_id){
        const [[row]] = await conn.query(
            `
            SELECT 1
            FROM bank_soal_pilihans
            WHERE id = ?
            AND bank_soal_id = ?
            LIMIT 1
            `,
            [bank_soal_pilihan_id, bank_soal_id]
        );
        return !!row;        
    }


    static async simpanJawaban(conn, data) {
        // console.log(data);
        const query = `
            INSERT INTO jawaban_pesertas
            (
                peserta_seleksi_id,
                bank_soal_id,
                bank_soal_pilihan_id,
                jawaban_text,
                nilai,
                created_at,
                updated_at
            )
            SELECT
                ps.id,
                ?,
                ?,
                ?,
                ?,
                NOW(),
                NOW()
            FROM peserta_seleksis ps
            JOIN pesertas p ON p.id = ps.peserta_id
            JOIN jadwal_seleksis js ON js.id = ps.jadwal_seleksi_id
            WHERE ps.id = ?
            AND p.id = ?
            AND p.is_login = 1
            AND ps.is_allow = 1
            AND (ps.is_done = 0 OR ps.is_done IS NULL)
            AND js.is_mulai = 1 AND (js.is_selesai = 0 OR js.is_selesai IS NULL)
            ON DUPLICATE KEY UPDATE
                bank_soal_pilihan_id = VALUES(bank_soal_pilihan_id),
                jawaban_text = VALUES(jawaban_text),
                nilai = VALUES(nilai),
                updated_at = NOW()
        `;

        const params = [
            data.bank_soal_id,
            data.bank_soal_pilihan_id,
            data.jawaban_text,
            data.nilai,
            data.peserta_seleksi_id,
            data.peserta_id
        ];

        const [result] = await conn.query(query, params);

        
        if (result.affectedRows === 0) {
            throw new Error('Tidak berhak menyimpan jawaban');
        }
    }

    static async selesaiUjian(conn, peserta_id, peserta_seleksi_id) {
        const query = `
            UPDATE peserta_seleksis ps
            JOIN pesertas p ON p.id = ps.peserta_id
            SET 
                ps.is_done = 1,
                ps.updated_at = NOW()
            WHERE ps.id = ?
            AND p.id = ?
            AND ps.is_allow = 1
            AND ps.is_done = 0
            AND p.is_login = 1
        `;

        const [result] = await conn.query(query, [
            peserta_seleksi_id,
            peserta_id
        ]);

        return result.affectedRows > 0;
    }

    static async mulaiJadwalUjian(conn, jadwal_seleksi_id, pengawas_id) {
        const query = `
            UPDATE jadwal_seleksis js
            LEFT jOIN pengawas_seleksis ss ON ss.jadwal_seleksi_id = js.id
            SET 
                js.is_mulai = 1,
                js.mulai_at = NOW(),
                updated_at = NOW()
            WHERE js.id = ? AND ss.user_id = ? AND (js.is_mulai = 0 OR js.is_mulai IS NULL)`;

        const [result] = await conn.query(query, [jadwal_seleksi_id, pengawas_id]);
        return result;
    }

    static async selesaiJadwalUjian(conn, jadwal_seleksi_id, pengawas_id) {
        const query = `
            UPDATE jadwal_seleksis js
            LEFT jOIN pengawas_seleksis ss ON ss.jadwal_seleksi_id = js.id
            SET 
                js.is_selesai = 1,
                js.selesai_at = NOW(),
                updated_at = NOW()
            WHERE js.id = ? js.is_mulai = 1 AND ss.user_id = ?`;
        const [result] = await conn.query(query, [jadwal_seleksi_id, pengawas_id]);
        return result;
    }

    static async akhiriPesertaSesiUjian(conn, jadwal_seleksi_id) {
        // 1. tutup sesi ujian
        const queryJadwal = `
            UPDATE jadwal_seleksis js
            SET 
                js.is_selesai = 1,
                js.selesai_at = NOW(),
                js.updated_at = NOW()
            WHERE js.id = ?
            AND js.is_mulai = 1
            AND (js.is_selesai = 0 OR js.is_selesai IS NULL)
        `;

        const [jadwalResult] = await conn.query(queryJadwal, [jadwal_seleksi_id]);

        // jika jadwal tidak berubah, hentikan
        if (jadwalResult.affectedRows === 0) {
            return jadwalResult;
        }

        // 2. set peserta selesai
        const queryPeserta = `
            UPDATE peserta_seleksis ps
            SET 
                ps.is_done = 1,
                ps.updated_at = NOW()
            WHERE ps.jadwal_seleksi_id = ?
            AND ps.is_enter = 1
            AND ps.is_allow = 1
            AND ps.is_done = 0
        `;

        await conn.query(queryPeserta, [jadwal_seleksi_id]);
        return jadwalResult;
    }

    static async mulaiJadwalUjian(conn, jadwal_seleksi_id, pengawas_id) {
        const query = `
            UPDATE jadwal_seleksis js
            INNER JOIN pengawas_seleksis ss 
                ON ss.jadwal_seleksi_id = js.id
            SET 
                js.is_mulai = 1,
                js.mulai_at = NOW(),
                js.updated_at = NOW()
            WHERE js.id = ?
            AND ss.user_id = ?
            AND (js.is_mulai = 0 OR js.is_mulai IS NULL)
        `;

        const [result] = await conn.query(query, [jadwal_seleksi_id, pengawas_id]);
        return result;
    }

    static async selesaiJadwalUjian(conn, jadwal_seleksi_id, pengawas_id) {

        // 1. tutup sesi ujian
        const queryJadwal = `
            UPDATE jadwal_seleksis js
            INNER JOIN pengawas_seleksis ss 
                ON ss.jadwal_seleksi_id = js.id
            SET 
                js.is_selesai = 1,
                js.selesai_at = NOW(),
                js.updated_at = NOW()
            WHERE js.id = ?
            AND js.is_mulai = 1
            AND ss.user_id = ?
            AND (js.is_selesai = 0 OR js.is_selesai IS NULL)
        `;

        const [jadwalResult] = await conn.query(queryJadwal, [jadwal_seleksi_id, pengawas_id]);

        // jika jadwal tidak berubah, hentikan
        if (jadwalResult.affectedRows === 0) {
            return jadwalResult;
        }

        // 2. set peserta selesai
        const queryPeserta = `
            UPDATE peserta_seleksis ps
            SET 
                ps.is_done = 1,
                ps.updated_at = NOW()
            WHERE ps.jadwal_seleksi_id = ?
            AND ps.is_enter = 1
            AND ps.is_allow = 1
            AND ps.is_done = 0
        `;

        await conn.query(queryPeserta, [jadwal_seleksi_id]);
        return jadwalResult;
    }


}

module.exports = UjianModel;
