// app/services/ReschedulePesertaService.js
const db = require('../../config/database');
const fs = require('fs').promises;

const ReschedulePesertaModel = require('../models/ReschedulePesertaModel');
const MediaPathModel = require('../models/MediaPathModel');
const SeleksiModel = require('../models/SeleksiModel');
const MediaPathService = require('../services/MediaPathService');
// const UserModel = require('../models/UserModel');

const {pickFields} = require('../helpers/payloadHelper');
const PesertaSeleksiModel = require('../models/PesertaSeleksiModel');


class ReschedulePesertaService {

    /**
     * Ambil semua ReschedullePeserta (paging + search)
     */

    static async getAll(dataWeb) {
        const query = dataWeb.query;
        const peserta_id = parseInt(dataWeb.user.id) || null;
        // const peserta_seleksi_id = parseInt(dataWeb.params.peserta_seleksi_id) || null;
        
        const page  = parseInt(query.page) || 1;
        const limit = query.limit != null ? parseInt(query.limit) : 10;
        const offset = (page - 1) * limit;

        const where = [];
        const params = [];

        // search umum
        if (query.search) {
            where.push(`(p.email LIKE ? OR p.nama LIKE ? OR p.nomor_peserta LIKE ? OR p.hp LIKE ?)`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
        }

        where.push(`(p.id = ?)`);
        params.push(`${peserta_id}`);

        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';

        const conn = await db.getConnection();
        try {
            const data  = await ReschedulePesertaModel.findAll(conn, whereSql, params, limit, offset);
            const total = await ReschedulePesertaModel.countAll(conn, whereSql, params);

            return {
                data,
                meta: {
                    page,
                    limit,
                    total
                }
            };
        } finally {
            conn.release();
        }
    }

    /**
     * Detail ReschedullePeserta
     */
    static async findById(id, peserta_id) {
        const conn = await db.getConnection();
        try {
            const ReschedullePeserta = await ReschedulePesertaModel.findByIdandPesertaId(conn, id, peserta_id);
            if (!ReschedullePeserta) {
                throw new Error('Data tidak ditemukan');
            }
            return ReschedullePeserta;
        } finally {
            conn.release();
        }
    }

    /**
     * Simpan ReschedullePeserta baru
     */
    static async store(data,fileUpload) {
        const conn = await db.getConnection();
        const uploadedPath = fileUpload.file;
        try {
            await conn.beginTransaction();

            const seleksi = await ReschedulePesertaModel.cariInfoSeleksi(conn, data.peserta_seleksi_id);
            if (!seleksi) {
                throw new Error('Data tidak ditemukan');
            }

            if(!seleksi.reschedule_aktif){
                throw new Error('Maaf, pembuatan reschedule pada seleksi ini tidak bisa dilakukan');
            }

            const uuid = await MediaPathService.generateUniqueKey(conn);
            const media_path_id = await MediaPathModel.insert(conn, {
                judul:'Reschedulle Ujian',
                path: uploadedPath,
                jenis:'dokumen',
                uuid,
            });

            const payload = pickFields(data,ReschedulePesertaModel.columns);
            payload.media_path_id = media_path_id;
            console.log(payload);

            const ReschedullePesertaId = await ReschedulePesertaModel.insert(conn,payload);
            await conn.commit();

            return await ReschedulePesertaModel.findById(conn, ReschedullePesertaId);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update ReschedullePeserta
     */
    static async update(id, peserta_id, data, fileUpload ) {
        const conn = await db.getConnection();
        const uploadedPath = fileUpload?.file;
        let mediaPathLama = null;
        let media = null;
        try {
            await conn.beginTransaction();
            const payload = pickFields(data,ReschedulePesertaModel.columns);    
            if(uploadedPath){
                mediaPathLama = await ReschedulePesertaModel.cariMediPath(conn, id, peserta_id);

                const uuid = await MediaPathService.generateUniqueKey(conn);
                const media_path_id = await MediaPathModel.insert(conn, {
                    judul:'Reschedulle Ujian',
                    path: uploadedPath,
                    jenis:'dokumen',
                    uuid,
                });
                payload.media_path_id = media_path_id;
            }

            const affected = await ReschedulePesertaModel.update(conn, id, peserta_id, payload);
            if (affected === 0) {
                throw new Error('Data peserta tidak ditemukan atau tidak ada perubahan');
            }
            
            if(mediaPathLama?.media_path_id){
                media = await this.hapusFileLama(conn, mediaPathLama.media_path_id);
            }
            await conn.commit();


            if (media?.path) {
                await fs.unlink(media.path).catch(() => {});
            }                


            return await ReschedulePesertaModel.findById(conn, id);


        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    static async kirim(id, peserta_seleksi_id ) {
        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();
            const payload = {
                peserta_seleksi_id,
                is_kirim:1
            }
            // console.log(id,payload);
            const affected = await ReschedulePesertaModel.kirim(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();

            return await ReschedulePesertaModel.findById(conn, id);


        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    static async hapusFileLama(conn, id) {
        const data = await MediaPathModel.findById(conn,id);
        const affected = await MediaPathModel.deleteById(conn, id);
        if (affected === 0) {
            throw new Error('Data tidak ditemukan');
        }
        return data;
    }
    
    /**
     * Hapus ReschedullePeserta
     */
    static async destroy(id, peserta_id, peserta_seleksi_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const dataLama = await ReschedulePesertaModel.cariMediPath(conn, id, peserta_id);
            const media = await this.hapusFileLama(conn, dataLama.media_path_id);
            
            const affected = await ReschedulePesertaModel.delete(conn, id, peserta_seleksi_id);

            if (affected === 0) {
                throw new Error('Data reschedulle tidak ditemukan');
            }

            await conn.commit();
            
            if (media.path) {
                await fs.unlink(media.path).catch(() => {});
            }                


            return { id };

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }
}

module.exports = ReschedulePesertaService;
