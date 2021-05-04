//Validation
const Joi = require('@hapi/joi');

//Ar Validation
exports.articlesValidation = data => {
        const schema = Joi.object({
                title: Joi.string().required(),
                body: Joi.string().required(),
                author: Joi.string().required(),
        })
        return schema.validate(data)
}
