// requests/UserRequest.js
const Joi = require('joi');

class UserRequest {

    static store(data) {
        return Joi.object({
            name: Joi.string().min(3).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            name: Joi.string().min(3).optional(),
            email: Joi.string().email().optional(),
            password: Joi.string().min(6).optional()
        })
        .min(1) // minimal 1 field harus ada
        .validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static login(data) {
        return Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(4).required()
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static resetPassword(data) {
        return Joi.object({
            password: Joi.string().min(4).required()
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }
}

module.exports = UserRequest;
