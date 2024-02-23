import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { async } from 'rxjs';
import { query } from 'express';

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
    viewAllConnections(@Request() req) {
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
    revokeConnection(@Param('connectionId') connectionId: number, @Request() req) {
        const userdId = req.user.id;
        return this.connectionService.revokeConnection(+connectionId, userdId)
    }

    // connectionProfile
    @UseGuards(AuthGuard)
    @Get('connectionprofile/:sendingUserId')
    connectionProfile(@Param('sendingUserId') sendingUserId: number, @Request() req) {
        return this.connectionService.connectionProfile(+sendingUserId)
    }

    // return suggested connections basing on Distance and Activities
    @UseGuards(AuthGuard)
    @Get("suggestions")
    async SuggestedConnectionBasedDistanceAndActivites(@Request() req) {
        const user = req.user;
        return this.connectionService.SuggestedConnectionBasedDistanceAndActivites(+user.id)
    }

    /**
     * user filter the suggested connection based on location, activity, skillLevel and playStyle
     * @param req 
     * @param location 
     * @param activity 
     * @param skillLevel 
     * @param playStyle 
     */
    @UseGuards(AuthGuard)
    @Get('connectionfilter')
    async filterConnections(@Request() req, @Query('location') location: string, @Query('activity') activity: string, @Query('skillLevel') skillLevel: string, @Query('playStyle') playStyle: string) {
        const user = req.user;
        const queries = req.query;
        let data;
        try {
            data = await this.connectionService.SuggestedConnectionBasedDistanceAndActivites(+user.id);
            if (queries.location) {
                data = data.filter(connection => connection.location['name'].toLowerCase().includes(queries.location.toLowerCase()));
            }
            if (queries.activity) {
                data = data.filter(connection => connection.activities.some(act => act.activity_name.toLowerCase().includes(queries.activity.toLowerCase())));
            }
            if (queries.skillLevel) {
                data = data.filter(connection => connection.activities.some(act => act.skillLevel.toLowerCase().includes(queries.skillLevel.toLowerCase())));
            }
            if (queries.playStyle) {
                data = data.filter(connection => connection.activities.some(act => act.playStyle.toLowerCase().includes(queries.playStyle.toLowerCase())));
            }
            if (data.length > 0) return data;
            return new HttpException("No connection that match the criteria", HttpStatus.NOT_FOUND)

        } catch (error) {
            return { error: 'An error occurred while fetching connections' };
        }
    }


}
