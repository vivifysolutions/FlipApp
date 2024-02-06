import { Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('connections')
export class ConnectionsController {
    constructor(private connectionService:ConnectionsService){}

    @UseGuards(AuthGuard)
    @Post('request/:receiverId')
    connectUsers(@Param('receiverId') receiverId:string, @Request() req){
        console.log(req.user)
        const user = req.user;
        return this.connectionService.connectUsers(user.id, +receiverId)
    }
}
