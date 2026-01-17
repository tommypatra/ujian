// requests/BankSoalPilihanRequest.js
const Joi = require('joi');

class BankSoalPilihanRequest {

    static store(data) {
        // 'jenis_soal_id', 'domain_soal_id', 'tahun', 
        // 'pembuat_user_id', 'pertanyaan', 'media_path', 'bobot', 'is_aktif' 

        return Joi.object({
            pilihan: Joi.string().trim().max(180).required(),
            is_benar: Joi.number().integer().valid(0, 1).optional()
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            pilihan: Joi.string().trim().max(180).optional(),
            is_benar: Joi.number().integer().valid(0, 1).optional()
        })
        .min(1)
        .validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = BankSoalPilihanRequest;