// app/services/AuthService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');

const UserModel = require('../models/UserModel');
const PesertaModel = require('../models/PesertaModel');
const PengawasSeleksiModel = require('../models/PengawasSeleksiModel');

const UserRoleModel = require('../models/UserRoleModel');

class AuthService {

    static async login(data) {
        const conn = await db.getConnection();

        try {
            const { email, password } = data;

            // ambil user by email
            const user = await UserModel.findByEmail(conn, email);
            if (!user) {
                throw new Error('User tidak ditemukan');
            }

            // cek password
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new Error('Password salah');
            }

            // load roles user
            const roles = await UserRoleModel.findAllByUserId(conn, user.id);
            // contoh hasil: ['admin', 'pengguna']

            // generate JWT
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    roles
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES || '6d'
                }
            );

            return {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    roles
                },
                token
            };

        } finally {
            conn.release();
        }
    }

    /**
    * Login Seleksi
    */
    static async loginSeleksi(data) {
        const conn = await db.getConnection();
        try {
            const { user_name, password, login_sebagai, seleksi_id } = data;

            let akun = null;
            if(login_sebagai==='peserta'){
                akun = await PesertaModel.findByUserName(conn, user_name, seleksi_id);
                if(akun && akun.is_login==1){
                    throw new Error('Reset login akun anda terlebih dahulu pada pengawas ujian');
                }
            }else if(login_sebagai==='pengawas'){
                akun = await PengawasSeleksiModel.findByUserName(conn, user_name, seleksi_id);
            }else{
                throw new Error(`login khusus peserta atau pengawas seleksi`);
            }

            if (!akun) {        
                throw new Error(`${login_sebagai} tidak ditemukan`);
            }

            const valid = await bcrypt.compare(password, akun.password);
            if (!valid) {
                throw new Error('Password salah');
            }

            if(login_sebagai==='peserta'){
                PesertaModel.updateIsLogin(conn, akun.id);
            }

            const user = {
                    id: akun.id,
                    user_name: akun.user_name,
                    nama: akun.nama,
                    email: akun.email,
                    roles:[akun.role]
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

module.exports = AuthService;
