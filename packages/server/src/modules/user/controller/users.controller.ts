import { Body, Controller, Post, Patch, Put, UseGuards } from '@nestjs/common';
import { RegisterDto } from 'src/modules/user/dto/register.dto';
import { UserService } from 'src/modules/user/service/user.service';
import { AuthGuard } from '@nestjs/passport';
import { getUserMess } from 'src/shared/helpers/current-user.helper';
import type { TCurrentUser } from 'src/shared/helpers/current-user.helper';
import {
  UpdateProfileDto,
  UpdatePasswordDto,
} from 'src/modules/user/dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  register(@Body() body: RegisterDto) {
    const { phone, sendCode, password, confirm } = body;
    return this.userService.register(phone, sendCode, password, confirm);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(
    @Body() body: UpdateProfileDto,
    @getUserMess() user: TCurrentUser,
  ) {
    return this.userService.updateProfile(user.id, body);
  }

  @Put('me/password')
  @UseGuards(AuthGuard('jwt'))
  updatePassword(
    @Body() body: UpdatePasswordDto,
    @getUserMess() user: TCurrentUser,
  ) {
    return this.userService.updatePassword(
      user.id,
      body.oldPassword,
      body.newPassword,
    );
  }
}
