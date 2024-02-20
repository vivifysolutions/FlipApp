import { Global, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateWay } from './chat.gateway';



@Module({
  providers: [ChatGateWay,ChatService],
  controllers: [ChatController],
})
export class ChatModule {}