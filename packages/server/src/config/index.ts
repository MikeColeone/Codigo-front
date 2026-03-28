import type { JwtModuleOptions } from '@nestjs/jwt';
import type { RedisOptions } from 'ioredis';

export const redisConfig: RedisOptions = {
  host: '192.168.231.128',
  port: 6379,
};

export const TextMessageConfig = {
  AppKey: process.env.APP_KEY,
  AppSecret: process.env.APP_SECRET,
  AppCode: process.env.APPCODE,
};

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '7d' },
  global: true,
};

export const aliOssConfig = {
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAI5tDVf27tw64n85oxgKmc',
  accessKeySecret: 'process.env.ACCESS_KEY_SECRET',
  bucket: 'codigo-oss',
};

export const aliOssDomain = 'codigo-oss.oss-cn-beijing.aliyuncs.com';

export const WeChatLoginConfig = {};
