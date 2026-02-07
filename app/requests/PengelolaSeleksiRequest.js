// requests/PengelolaSeleksiRequest.js
const Joi = require('joi');
const jabatan_input = ['panitia', 'pembuat-soal', 'pengawas'];

class PengelolaSeleksiRequest {

    static store(data) {
        return Joi.object({
            user_id: Joi.number().integer().positive().required(),
            jabatan: Joi.string().valid(...jabatan_input).required()
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            user_id: Joi.number().integer().positive().optional(),
            jabatan: Joi.string().valid(...jabatan_input).optional()
        })
        .min(1)
        .validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = PengelolaSeleksiRequest;