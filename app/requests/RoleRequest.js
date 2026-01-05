// requests/RoleRequest.js
const Joi = require('joi');

class RoleRequest {

    static store(data) {
        return Joi.object({
            role: Joi.string().min(3).required(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            role: Joi.string().min(3).required(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = RoleRequest;
