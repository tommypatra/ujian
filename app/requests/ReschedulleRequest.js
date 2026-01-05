// requests/ReschedulleRequest.js
const Joi = require('joi');

class ReschedulleRequest {

    static store(data) {
        return Joi.object({
            peserta_seleksi_id: Joi.number().integer().positive().required(),
            alasan: Joi.string().min(6).optional(),
            dokumen_pendukung: Joi.string().min(6).required(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            peserta_seleksi_id: Joi.number().integer().positive().required(),
            alasan: Joi.string().min(6).optional(),
            dokumen_pendukung: Joi.string().min(6).optional(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static validasi(data) {
        return Joi.object({
            status: Joi.string()
                .valid('approved', 'rejected')
                .required(),
            catatan_verifikasi: Joi.when('status', {
                is: 'rejected',
                then: Joi.string().min(6).required(),
                otherwise: Joi.string().optional()
            }),
            verified_at: Joi.date().default(() => new Date(), 'current date'),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }
}

module.exports = ReschedulleRequest;
