// app/services/UjianService.js
const db = require('../../config/database');
const fs = require('fs');
const path = require('path');
const UjianModel = require('../models/UjianModel');

const { pickFields } = require('../helpers/payloadHelper');

class UjianService {

    /**
     * Ambil soal ujian per range (lazy load)
     */
    static async getSoalByRange(peserta_id, jadwal_seleksi_id, start = 1, limit = 20) {
        const conn = await db.getConnection();
        try {
            const data = await UjianModel.getSoalByRange(
                conn,
                peserta_id, 
                jadwal_seleksi_id,
                start,
                limit
            );

            return {
                start,
                limit,
                count: data.length,
                data
            };
        } finally {
            conn.release();
        }
    }

    static async findAllByPesertaId(peserta_id) {
        const conn = await db.getConnection();
        try {
            const row = await UjianModel.findAllByPesertaId(conn, peserta_id);
            if (!row) {
                throw new Error('Data tidak ditemukan');
            }
            return row;
        } finally {
            conn.release();
        }
    }
    

    /**
     * Simpan Jawaban
     */
    static async simpanJawaban(peserta_id,peserta_seleksi_id,data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const payload = {
                bank_soal_id:data.bank_soal_id,
                bank_soal_pilihan_id:data.bank_soal_pilihan_id,
                jawaban_text:data.jawaban_text,
                peserta_id:peserta_id,
                peserta_seleksi_id:peserta_seleksi_id
            }

            if(data.bank_soal_pilihan_id){
                const validPilihan = await UjianModel.cekPilihanSoal(
                    conn,
                    data.bank_soal_id,
                    data.bank_soal_pilihan_id
                );

                if (!validPilihan) {
                    throw new Error('Pilihan jawaban tidak valid untuk soal ini');
                }
            }

            const simpanJawaban = await UjianModel.simpanJawaban(conn, payload);
            await conn.commit();
            return simpanJawaban;

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    static async enterUjian(peserta_id, jadwal_seleksi_id, data) {
        const conn = await db.getConnection();
        const uploadedPath = data?.enter_foto;

        try {
            if (!uploadedPath) {
                throw new Error('Foto enter ujian wajib ada');
            }
            await conn.beginTransaction();

            const affected = await UjianModel.enterUjian(conn, peserta_id, jadwal_seleksi_id, data);
            if (affected === 0) {
                throw new Error('proses enter ujian gagal dilakukan');
            }

            await conn.commit();
            return { success: true };
        } catch (err) {
            await conn.rollback();
            if (uploadedPath) {
                const filePath = path.join(process.cwd(), uploadedPath);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            throw err;
        } finally {
            conn.release();
        }
    }    

    static async selesaiUjian(peserta_id, peserta_seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const result = await UjianModel.selesaiUjian(
                conn,
                peserta_id,
                peserta_seleksi_id
            );

            if (!result) {
                throw new Error('Tidak berhak mengakhiri ujian');
            }

            await conn.commit();
            return { is_done: 1 };

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    
}

module.exports = UjianService;
