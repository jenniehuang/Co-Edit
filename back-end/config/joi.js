const Joi = require("joi");

const signupValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(10).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).max(255),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().max(255),
  });

  return schema.validate(data);
};

// const docValidation = (data) => {
//   const schema = Joi.object({
//     title:Joi.string().min(6).max(50).required()
//   })
// }

module.exports.signupValidation = signupValidation;
module.exports.loginValidation = loginValidation;
