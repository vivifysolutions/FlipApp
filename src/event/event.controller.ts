import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Request,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import { EventCreateDto, eventDto, registerEvent } from './dto/eventDto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('event')
export class EventController {
    constructor(private eventService:EventService){}

    // get user events 
    @UseGuards(AuthGuard)
    @Get('user/:id')
    getUserEvents(@Param('id') id:string){
        return this.eventService.getUserEvents(+id);
    }

    // create event 
    @UseGuards(AuthGuard)
    @Post("createEvent")
    userCreateEvent(@Request() req, @Body() body:EventCreateDto){
        const user = req.user;
        const event = {...body, hostId:user.id}
        return this.eventService.userCreateEvent(event)
    }

    // update event 
    @UseGuards(AuthGuard)
    @Put("updateevent/:eventId")
    userUpdateOwnCreatedEvent(@Param('eventId') eventId:number, @Request() req, @Body() eventInfo: eventDto){
        const user = req.user;
        const event = {
            ...eventInfo, 
            id: +eventId,
            hostId: +user.id
        }
        return this.eventService.userUpdateOwnCreatedEvent(event);
    }

    // delete event 
    @UseGuards(AuthGuard)
    @Delete('deleteevent/:eventId')
    userDeleteEvent(@Param('eventId') eventId:number, @Request() req){
        const user = req.user;
        const event = {
            eventId: +eventId,
            userId: +user.id
        }
        return this.eventService.userDeleteEvent(event);
    }

    // user register for event 
    @UseGuards(AuthGuard)
    @Post('registerevent/:eventId')
    userRegisterForEvent(@Param('eventId') eventId:number, @Request() req){
        const user = req.user;
        const payload:registerEvent ={
            attendeeId: +user.id,
             eventId: +eventId,
        }

        return this.eventService.userRegisterForEvent(payload)
    }

    // get all events 
    @UseGuards(AuthGuard)
    @Get('allevents')
    async getAllEvents(@Request() req, @Qguery('title') title:string, @Query('location') location:string ){
        const hostId = req.user.id;
        const query = req.query
        let data = await this.eventService.getAllEvents(hostId);
        if(query.location){
            data = data.filter(event => event.location.toLowerCase().includes(query.location.toLowerCase()))
        }
        if(query.title){
            data = data.filter(event => event.title.toLowerCase().includes(query.title.toLowerCase()))
        }
        return data;
    }
}
