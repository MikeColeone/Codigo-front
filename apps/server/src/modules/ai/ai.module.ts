import { Module } from '@nestjs/common';
import { AiChatController } from 'src/modules/ai/controller/ai-chat.controller';
import { AiChatService } from 'src/modules/ai/service/ai-chat.service';

@Module({
  controllers: [AiChatController],
  providers: [AiChatService],
})
export class AiModule {}
