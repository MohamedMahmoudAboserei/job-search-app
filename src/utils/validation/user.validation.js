// import Joi from 'joi';
// import { genderTypes } from '../../db/model/User.model.js';

// export const updateProfile = Joi.object().keys({
//     userName: Joi.string().min(2).max(25),
//     phone: Joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
//     gender: Joi.string().valid(genderTypes.female, genderTypes.male),
//     DOB: Joi.date().less('now'),
// }).required()

// export const updatePassword = Joi.object().keys({
//     userName: Joi.string().min(2).max(25),
//     phone: Joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
//     gender: Joi.string().valid(genderTypes.female, genderTypes.male),
//     DOB: Joi.date().less('now'),
// }).required()