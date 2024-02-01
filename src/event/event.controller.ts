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
} from '@nestjs/common';
import { EventService } from './event.service';
import { EventCreateDto, eventDto } from './dto/eventDto';
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
}
