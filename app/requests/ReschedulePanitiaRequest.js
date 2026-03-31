// requests/RescheduleSeleksiRequest.js
const Joi = require('joi');

class RescheduleSeleksiRequest {

    static store(data) {
        return Joi.object({
            status: Joi.string()
                .valid('proses', 'terima', 'tolak')
                .required(),

            catatan_verifikasi: Joi.when('status', {
                is: 'tolak',
                then: Joi.string().min(6).required(),
                otherwise: Joi.string().allow('', null).optional()
            }),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            status: Joi.string()
                .valid('proses', 'terima', 'tolak')
                .required(),

            catatan_verifikasi: Joi.when('status', {
                is: 'tolak',
                then: Joi.string().min(6).required(),
                otherwise: Joi.string().allow('', null).optional()
            }),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = RescheduleSeleksiRequest;
