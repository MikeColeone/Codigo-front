import { Module } from '@nestjs/common';
import { UserService } from 'src/modules/user/service/user.service';
import { UserController } from 'src/modules/user/controller/user.controller';
import { CaptchaTool } from 'src/shared/utils/captcha.tool';
import { SecretTool } from 'src/shared/utils/secret.tool';
import { TextMessageTool } from 'src/shared/utils/text-message.tool';
import { RandomTool } from 'src/shared/utils/random.tool';
import { AuthController } from 'src/modules/user/controller/auth.controller';
import { UsersController } from 'src/modules/user/controller/users.controller';

@Module({
  controllers: [UserController, AuthController, UsersController],
  providers: [
    UserService,
    SecretTool,
    CaptchaTool,
    TextMessageTool,
    RandomTool,
  ],
})
export class UserModule {}
