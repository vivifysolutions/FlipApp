import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatGateWay } from './chat.gateway';
import { ChatInterface } from './Interfaces/interface';
import { UtilitiesService } from 'src/utilities/utilities.service';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService, private readonly chatGateway: ChatGateWay, private util: UtilitiesService) { }

    async sendMessageToUser(message: ChatInterface) {
        await this.saveMessage(message)
        // this.chatGateway.server.emit('chatToClient',newMessage) 
        return this.util.dataReponseObject("Message sent", 200)

    }
    // this saves the message 
    async saveMessage(message: ChatInterface) {
        try {
            const checkIfUserAreConnected = await this.prisma.connection.findFirst({
                where: {
                    status: true,
                    OR: [
                        {
                            receivingUserId: message.receiverId,
                            sendingUserId: message.senderId
                        },
                        {
                            receivingUserId: message.senderId,
                            sendingUserId: message.receiverId
                        }
                    ]
                }
            })
            if (!checkIfUserAreConnected) return new HttpException("You must be connected", HttpStatus.FORBIDDEN)
            return await this.prisma.chat.create({
                data: {
                    senderId: message.senderId,
                    receiverId: message.receiverId,
                    content: message.content
                }
            })

        } catch (error) {
            return new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }
    // user get all messages 
    async getUserMessages(userId: number) {
       try {
        return await this.prisma.chat.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ],
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        photoUrl: true
                    }
                }
            },
            orderBy: {
                date: 'desc',
            }
        })
       } catch (error) {
            return new HttpException(error, HttpStatus.BAD_REQUEST);
       }
    }

    // mark message as read 
    async markAsRead(messageId: number) {
        try {
            return await this.prisma.chat.update({
                where: { id: messageId },
                data: { isRead: true }
            })
        } catch (error) {
            return new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    // get all unread Messages 
    async getAllUnreadMessages(userId:number){
        const unreadMessages  = await this.prisma.chat.findMany({
            where: { receiverId:userId, isRead:false },
        })
        if(unreadMessages.length <= 0){
            return this.util.dataReponseObject("No unread Messages found", 204)
        }
        return unreadMessages
    }

    // update message 
    async updateMessage(messageId:number, senderId:number, content:string){
        try {
            const getMessage = await this.prisma.chat.findFirst({
                where: {
                    id: messageId,
                    senderId: senderId
                }
            })
            if(!getMessage){
                return new HttpException("You can't Update the Message", HttpStatus.FORBIDDEN)
            }
            const updatedMessage = await this.prisma.chat.update({
                data:{
                    content:content
                },
                where:{
                    id: messageId,
                    senderId: senderId
                }
            })
            return updatedMessage; 
        } catch (error) {
            return new HttpException("Error updating message", HttpStatus.BAD_REQUEST)
        }
    }

    // delete message 
    async deleteMessage(messageId:number){
        await this.prisma.chat.delete({
            where:{
                id:messageId
            }
        })
        return this.util.dataReponseObject("Message deleted successfully", 204)
    }

}
