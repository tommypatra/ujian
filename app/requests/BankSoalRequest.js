// requests/BankSoalRequest.js
const Joi = require('joi');

class BankSoalRequest {

    static store(data) {
        // 'jenis_soal_id', 'domain_soal_id', 'tahun', 
        // 'pembuat_user_id', 'pertanyaan', 'media_path', 'bobot', 'is_aktif' 

        return Joi.object({
            jenis_soal_id: Joi.number().integer().positive().required(),
            domain_soal_id: Joi.number().integer().positive().required(),
            seleksi_id: Joi.number().integer().positive().required(),
            tahun: Joi.number().integer().positive().required(),
            bobot: Joi.number().integer().positive().optional(),
            is_aktif: Joi.number().integer().positive().optional(),
            pertanyaan: Joi.string().min(3).required(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            jenis_soal_id: Joi.number().integer().positive().optional(),
            domain_soal_id: Joi.number().integer().positive().optional(),
            seleksi_id: Joi.number().integer().positive().optional(),
            tahun: Joi.number().integer().positive().optional(),
            bobot: Joi.number().integer().positive().optional(),
            is_aktif: Joi.number().integer().positive().optional(),
            pertanyaan: Joi.string().min(3).required(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = BankSoalRequest;