import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { SkipResponseWrap } from 'src/core/interceptor/skip-response-wrap.decorator';
import { getUserMess } from 'src/shared/helpers/current-user.helper';
import type { TCurrentUser } from 'src/shared/helpers/current-user.helper';
import { AiChatService } from 'src/modules/ai/service/ai-chat.service';

type AiChatStreamRequest = {
  prompt: string;
  current?: Array<{
    id: string;
    type: string;
    props?: Record<string, unknown>;
    styles?: Record<string, unknown>;
  }>;
};

@Controller('ai/chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post('stream')
  @UseGuards(AuthGuard('jwt'))
  @SkipResponseWrap()
  async streamChat(
    @Body() body: AiChatStreamRequest,
    @Req() req: Request,
    @Res() res: Response,
    @getUserMess() user: TCurrentUser,
  ) {
    await this.aiChatService.streamChat({ body, req, res, user });
  }
}
