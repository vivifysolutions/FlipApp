import {
  Controller,
  Param,
  Request,
  Body,
  Post,
  UseGuards,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateWay } from './chat.gateway';
import { ChatInterface } from './Interfaces/interface';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('chat')
export class ChatController {
    constructor(private chatService:ChatService, private readonly chatGateway:ChatGateWay){}

    /**
     * sneding the message 
     * @param receiverId  
     */
    @UseGuards(AuthGuard)
    @Post(':receiverId')
    async sendMessage(@Param('receiverId') receiverId:number, @Request() req){
        const senderId = req.user.id;
        let payload:ChatInterface = {
            content: req.body.content,
            senderId: +senderId,
            receiverId: +receiverId
        }

        return this.chatService.saveMessage(payload);
    }

    /**
     * user get all messages
     */
    @UseGuards(AuthGuard)
    @Get("allMessages")
    getUserMessages(@Request() req){
        const user = req.user;
        return this.chatService.getUserMessages(+user.id)
    }

    /**
     * mark the message as read
     * @Param messageId
     */
    @UseGuards(AuthGuard)
    @Put("markasRead/:messageId")
    markAsRead(@Param("messageId") messageId:number){
        return this.chatService.markAsRead(+messageId)
    }
    /**
     * get all unread messages 
     */
    @UseGuards(AuthGuard)
    @Get("unreadMessages")
    getAllUnreadMessages(@Request() req){
        const user = req.user;
        return this.chatService.getAllUnreadMessages(+user.id)
    }

    /**
     * update message
     * @param, messageId
     */
    @UseGuards(AuthGuard)
    @Put('update/:messageId')
    updateMessage(@Request() req, @Param("messageId") messageId:number){
        const user = req.user;
        const content = req.body['content'];
        return this.chatService.updateMessage(+messageId, +user.id, content)
    }

    /**
     * delete a message
     * @param messageId
     */
    @UseGuards(AuthGuard)
    @Delete("deleteMessage/:messageId")
    deleteMessage(@Param("messageId") messageId:number){
        return this.chatService.deleteMessage(+messageId)
    }
}
