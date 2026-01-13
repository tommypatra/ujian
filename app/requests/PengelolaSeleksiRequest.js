// requests/PengelolaSeleksiRequest.js
const Joi = require('joi');

class PengelolaSeleksiRequest {

    static store(data) {
        return Joi.object({
            user_id: Joi.number().integer().positive().required(),
            jabatan: Joi.string().min(3).required(),        
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            user_id: Joi.number().integer().positive().required(),
            jabatan: Joi.string().min(3).optional(),        
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = PengelolaSeleksiRequest;