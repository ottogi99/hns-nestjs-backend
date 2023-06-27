import { ConfigModuleOptions } from "@nestjs/config";
import Joi from "joi";

export const DATASOURCE_CONFIG_VALIDATOR: ConfigModuleOptions = {
  validationSchema: Joi.object({
    type: 'mysql',
    host: Joi.string().required(),
    port: Joi.number().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    database: Joi.string().required(),
  }),
  isGlobal: true,
}

import { registerAs } from '@nestjs/config';

export default registerAs('mysql', () => ({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  logging: process.env.DATABASE_LOGGING === 'true'  
}));
