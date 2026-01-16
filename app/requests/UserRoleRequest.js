// requests/UserRoleRequest.js
const Joi = require('joi');

class UserRoleRequest {

    static store(data) {
        return Joi.object({
            user_id: Joi.number().integer().positive().required(),
            role_id: Joi.number().integer().positive().required(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            user_id: Joi.number().integer().positive().optional(),
            role_id: Joi.number().integer().positive().optional(),
        })
        .min(1)
        .validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = UserRoleRequest;