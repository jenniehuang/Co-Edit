const Joi = require("joi");

const signupValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(20).required(),
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

const userDataValidation = (data) => {
  const schema = Joi.object({
    link: Joi.string().regex(new RegExp("https?://"), "http:// or https://"),
    about: Joi.string().max(100),
    thumbnailURL: Joi.string(),
    backgroundURL: Joi.string(),
  });

  return schema.validate(data);
};

module.exports.signupValidation = signupValidation;
module.exports.loginValidation = loginValidation;
module.exports.userDataValidation = userDataValidation;
