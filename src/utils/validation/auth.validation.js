// import Joi from 'joi';

// export const signupValidationSchema = Joi.object().keys({
//     userName: Joi.string().min(2).max(25).required(),
//     email: Joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['com', 'edu'] } }).required(),
//     password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
//     confirmationPassword: Joi.string().valid(Joi.ref('password')).required(),
//     phone: Joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)).required(),
//     // role: Joi.string().valid(roleTypes.ADMIN, roleTypes.USER).required(),
// });

// export const loginValidationSchema = Joi.object().keys({
//     email: Joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['com', 'edu'] } }).required(),
//     password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
// });

// export const queryValidation = Joi.object().keys({
//     lang: Joi.string().valid('en', 'ar').default('en').required()
// })