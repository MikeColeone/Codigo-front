import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, redisConfig, typeOrmConfig } from '../config';
import { UserModule } from './user/user.module';
import { RedisModule } from './utils/modules/redis.module';
import { User } from './user/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    { ...TypeOrmModule.forFeature([User]), global: true },
    UserModule,
    RedisModule.forRoot(redisConfig),
    JwtModule.register(jwtConfig),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
