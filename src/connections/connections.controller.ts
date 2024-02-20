import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('connections')
export class ConnectionsController {
    constructor(private connectionService: ConnectionsService) { }

    // user sending connection request 
    @UseGuards(AuthGuard)
    @Post('request/:receiverId')
    connectUsers(@Param('receiverId') receiverId: string, @Request() req) {
        const user = req.user;
        return this.connectionService.connectUsers(user.id, +receiverId)
    }

    // user get all the connections
    @UseGuards(AuthGuard)
    @Get("allconnections")
    viewAllConnections(@Request() req){
        const id = req.user.id;
        return this.connectionService.viewAllConnections(+id)
    }
    // user view all pending received requests 

    @UseGuards(AuthGuard)
    @Get('pendingconnections')
    getAllPendingreceivedConnections(@Request() req) {
        const user = req.user
        return this.connectionService.getAllPendingreceivedConnections(user.id);
    }

    // user accept a specified request 
    @UseGuards(AuthGuard)
    @Put('acceptpendingconnections/:connectSentId')
    userAcceptConnectRequest(@Param('connectSentId') connectSentId: number, @Request() req) {
        const receiver = req.user;
        return this.connectionService.userAcceptConnectRequest(receiver.id, +connectSentId)
    }

    // user revoke connection 
    @UseGuards(AuthGuard)
    @Delete('revokeConnection/:connectionId')
    revokeConnection(@Param('connectionId') connectionId:number, @Request() req){
        const userdId = req.user.id;
        return this.connectionService.revokeConnection(+connectionId, userdId)
    }

    // connectionProfile
    @UseGuards(AuthGuard)
    @Get('connectionprofile/:sendingUserId')
    connectionProfile(@Param('sendingUserId') sendingUserId:number, @Request() req){
        return this.connectionService.connectionProfile(+sendingUserId)
    }

     // return suggested connections basing on Distance and Activities
     @UseGuards(AuthGuard)
     @Get("suggestions") 
     async SuggestedConnectionBasedDistanceAndActivites(@Request() req){
        const user = req.user;
        return this.connectionService.SuggestedConnectionBasedDistanceAndActivites(+user.id)
     }


}
