// requests/PesertaRequest.js
const Joi = require('joi');

class PesertaRequest {

    static store(data) {
        return Joi.object({
            nomor_peserta: Joi.string().min(3).required(),            
            seleksi_id: Joi.number().integer().positive().required(),
            nama: Joi.string().min(3).required(),
            user_name: Joi.string().min(3).optional(),
            password: Joi.string().min(6).optional(),
            jenis_kelamin: Joi.string().optional(),      
            tanggal_lahir: Joi.date().required(),
            hp: Joi.string().min(9).optional(),
            email: Joi.string().email().optional(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            nomor_peserta: Joi.string().min(3).required(),            
            seleksi_id: Joi.number().integer().positive().required(),
            nama: Joi.string().min(3).required(),
            user_name: Joi.string().min(3).optional(),
            password: Joi.string().min(6).optional(),
            jenis_kelamin: Joi.string().optional(),      
            tanggal_lahir: Joi.date().required(),
            hp: Joi.string().min(9).optional(),
            email: Joi.string().email().optional(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = PesertaRequest;
