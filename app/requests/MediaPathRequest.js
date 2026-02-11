// requests/MediaPathRequest.js
const Joi = require('joi');

class MediaPathRequest {

    static store(data) {
        return Joi.object({
            jenis: Joi.string().valid('gambar', 'audio','video','pdf').optional(),
            judul: Joi.string().min(1).optional(),
            path: Joi.string().min(3).required(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            jenis: Joi.string().valid('gambar', 'audio','video','pdf').optional(),
            judul: Joi.string().min(1).optional(),
            path: Joi.string().min(3).optional(),
        })
        .min(1)
        .validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = MediaPathRequest;
