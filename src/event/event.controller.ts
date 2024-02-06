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
} from '@nestjs/common';
import { EventService } from './event.service';
import { EventCreateDto, eventDto, registerEvent } from './dto/eventDto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('event')
export class EventController {
    constructor(private eventService:EventService){}

    @Get('user/:id')
    getUserEvents(@Param('id') id:string){
        return this.eventService.getUserEvents(+id);
    }

    @UseGuards(AuthGuard)
    @Post("createEvent")
    userCreateEvent(@Request() req, @Body() body:EventCreateDto){
        const user = req.user;
        const event = {...body, hostId:user.id}
        return this.eventService.userCreateEvent(event)
    }

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
}
