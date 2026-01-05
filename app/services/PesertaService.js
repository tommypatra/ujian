// app/services/PesertaService.js
const jwt = require('jsonwebtoken');
const db = require('../../config/database');
const bcrypt = require('bcryptjs');

const PesertaModel = require('../models/PesertaModel');
const SeleksiModel = require('../models/SeleksiModel');

const {pickFields} = require('../helpers/payloadHelper');
const {dateToString} = require('../helpers/webHelper');


class PesertaService {

    /**
     * Ambil semua Peserta (paging + search)
     */
    static async getAll(dataWeb) {
        const query = dataWeb.query;
        const seleksi_id = parseInt(dataWeb.params.seleksi_id) || null;

        const page  = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        const where = [];
        const params = [];

        // search umum
        if (query.search) {
            // p.hp, p.email, p.nama, p.nomor_peserta, p.user_name
            where.push(`(p.email LIKE ? OR p.nama LIKE ? OR p.nomor_peserta LIKE ? OR p.hp LIKE ?)`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
        }

        // filter by seleksi_id
        if(seleksi_id){
            where.push(`(p.seleksi_id = ?)`);
            params.push(`${seleksi_id}`);
        }

        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';

        const conn = await db.getConnection();
        try {
            const data  = await PesertaModel.findAll(conn, whereSql, params, limit, offset);
            const total = await PesertaModel.countAll(conn, whereSql, params);

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
     * Detail Peserta
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const Peserta = await PesertaModel.findById(conn, id);
            if (!Peserta) {
                throw new Error('Data tidak ditemukan');
            }
            return Peserta;
        } finally {
            conn.release();
        }
    }

    /**
     * Detail Peserta
     */
    static async findBySesi(sesi) {
        const conn = await db.getConnection();
        try {
            const Peserta = await PesertaModel.findBySesi(conn, sesi);
            if (!Peserta) {
                throw new Error('Data tidak ditemukan');
            }
            return Peserta;
        } finally {
            conn.release();
        }
    }

    /**
     * Simpan Peserta baru
     */
    static async store(data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const seleksi = await SeleksiModel.findById(conn, data.seleksi_id);
            if (!seleksi) {
                throw new Error('Seleksi tidak ditemukan');
            }
            // console.log(seleksi);
            const prefix = seleksi.prefix_app;

            const payload = pickFields(data,PesertaModel.columns);

            payload.user_name = `${prefix}${data.nomor_peserta}`;
            const tanggal_lahir = dateToString(data.tanggal_lahir); 
            let plainPassword= tanggal_lahir;
            if (data.password && data.password.trim() !== '') {
                plainPassword=data.password;
            }
            payload.tanggal_lahir = tanggal_lahir;
            payload.password = await bcrypt.hash(plainPassword, 10);

            const PesertaId = await PesertaModel.insert(conn,payload);
            await conn.commit();

            const dataPeserta = await PesertaModel.findById(conn, PesertaId);

            return {
                ...dataPeserta,
                password: plainPassword
            };            

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update Peserta
     */
    static async update(id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const seleksi = await SeleksiModel.findById(conn, data.seleksi_id);
            if (!seleksi) {
                throw new Error('Seleksi tidak ditemukan');
            }

            const payload = pickFields(data,PesertaModel.columns);
            let plainPassword='';
            if (data.password && data.password.trim() !== '') {
                plainPassword=data.password;
                payload.password = await bcrypt.hash(plainPassword, 10);
            }
            
            const affected = await PesertaModel.update(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();

            const result = await PesertaModel.findById(conn, id);

            return {
                ...result,
                password: plainPassword
            };            

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus Peserta
     */
    static async destroy(id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await PesertaModel.deleteById(conn, id);

            if (affected === 0) {
                throw new Error('Data tidak ditemukan');
            }

            await conn.commit();
            return { id };

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
    * Login Peserta
    */
    static async login(data) {
        const conn = await db.getConnection();
        try {
            const { user_name, password, seleksi_id } = data;

            const peserta = await PesertaModel.findByUserName(conn, user_name, seleksi_id);
            if (!peserta) {
                throw new Error('Peserta tidak ditemukan');
            }
            console.log(peserta.password);
            const valid = await bcrypt.compare(password, peserta.password);
            if (!valid) {
                throw new Error('Password salah');
            }
            const user = {
                    id: peserta.id,
                    user_name: peserta.user_name,
                    nama: peserta.nama,
                    email: peserta.email,
                    roles:['peserta']
                };

            const token = jwt.sign(
                user,
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES || '6d'
                }
            );

            return {
                user,
                token
            };

        } finally {
            conn.release();
        }
    }

}

module.exports = PesertaService;
