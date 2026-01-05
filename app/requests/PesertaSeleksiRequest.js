// requests/PesertaSeleksiRequest.js
const Joi = require('joi');

class PesertaSeleksiRequest {

    static store(data) {
        return Joi.object({
            peserta_id: Joi.number().integer().positive().required(),
            jadwal_seleksi_id: Joi.number().integer().positive().required(),
            is_login: Joi.number().integer().optional(),
            login_foto: Joi.string().min(6).optional(),
            login_at: Joi.date().optional(),
            is_allow: Joi.number().integer().optional(),
            allow_at: Joi.date().optional(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            peserta_id: Joi.number().integer().positive().required(),
            jadwal_seleksi_id: Joi.number().integer().positive().required(),
            is_login: Joi.number().integer().optional(),
            login_foto: Joi.string().min(6).optional(),
            login_at: Joi.date().optional(),
            is_allow: Joi.number().integer().optional(),
            allow_at: Joi.date().optional(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = PesertaSeleksiRequest;
