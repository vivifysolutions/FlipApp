import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { ChatService } from './chat.service';



@WebSocketGateway(80)
export class ChatGateWay implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer() server:Server; 
  
    // constructor(private chatService:ChatService){}
    private logger: Logger = new Logger('ChatGateway');

    // constructor(private chatService:ChatService){}
    
    handleConnection(client: Socket, ...args: any[]) {
      this.logger.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('sendMessage')
    async handlechat(client:any, payload:any){
      this.logger.log("hiii ni dnjfsfjsdbfh",client.id)
        this.server.emit('newMessage', payload);
    }
}