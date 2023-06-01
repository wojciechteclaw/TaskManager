import * as Joi from 'joi';

export const configValidation = Joi.object({
  DB_PORT: Joi.number().default(5434).required(),
  DB_HOST: Joi.string().default('localhost'),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  SECRET_KEY: Joi.string().required(),
  STAGE: Joi.string().valid('dev', 'prod').default('dev'),
});
