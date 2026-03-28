import { Module } from '@nestjs/common';
import { ResourcesService } from 'src/modules/resources/service/resources.service';
import { ResourcesController } from 'src/modules/resources/controller/resources.controller';
import { MulterModule } from '@nestjs/platform-express';
import { AliOssModule } from 'src/shared/modules/ali-oss.module';
import { aliOssConfig } from 'src/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resources } from 'src/modules/resources/entity/resources.entity';

@Module({
  imports: [
    MulterModule.register({ dest: '__temps__' }),
    AliOssModule.forRoot(aliOssConfig),
    TypeOrmModule.forFeature([Resources]),
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
