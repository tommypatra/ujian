// app/services/AuthService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');

const UserModel = require('../models/UserModel');
const UserRoleModel = require('../models/UserRoleModel');

class AuthService {

    static async login(data) {
        const conn = await db.getConnection();

        try {
            const { email, password } = data;

            // 1️⃣ ambil user by email
            const user = await UserModel.findByEmail(conn, email);
            if (!user) {
                throw new Error('User tidak ditemukan');
            }

            // 2️⃣ cek password
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new Error('Password salah');
            }

            // 3️⃣ load roles user
            const roles = await UserRoleModel.findAllByUserId(conn, user.id);
            // contoh hasil: ['admin', 'pengguna']

            // 4️⃣ generate JWT
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
}

module.exports = AuthService;
