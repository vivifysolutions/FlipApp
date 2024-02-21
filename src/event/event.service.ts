import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { eventDto, registerEvent } from './dto/eventDto';
import { UtilitiesService } from 'src/utilities/utilities.service';


@Injectable()
export class EventService {
    constructor(private prismaService: PrismaService, private util: UtilitiesService) { }

    // get all events
    // this mostly to be used by admin 
    async getUserEvents(userId: number) {
        try {
            const events = await this.prismaService.event.findMany({
                where: {
                    hostId: userId,
                }
            })
            return events.length > 0 ? events : this.util.dataReponseObject("You have no events", 200)
        } catch (error) {
            throw new Error(error)
        }
    }
    
    // create an event 
    async userCreateEvent(eventInfo: eventDto) {
        try {
            await this.prismaService.event.create({
                data: {
                    title: eventInfo.title,
                    description: eventInfo.description,
                    status: eventInfo.status,
                    Date: eventInfo.Date,
                    startTime: eventInfo.startTime,
                    endTime: eventInfo.endTime,
                    location: eventInfo.location,
                    hostId: eventInfo.hostId
                }
            })

            return this.util.dataReponseObject("Event Created Successfully", 200)

        } catch (error) {
            throw new Error(error)
        }
    }

    // user update event
    async userUpdateOwnCreatedEvent(eventInfo: eventDto){
        try {
            const event = await this.prismaService.event.findFirst({
                where:{
                    id: eventInfo.id,
                }
            })
            if(!event) return new HttpException("Event Doesn't exist", HttpStatus.NOT_FOUND)

            if(event.hostId !== eventInfo.hostId) return new HttpException("You can only update your events", HttpStatus.UNAUTHORIZED)
        
            await this.prismaService.event.updateMany({
                data:{
                    title: eventInfo.title,
                    description: eventInfo.description,
                    status: eventInfo.status,
                    Date: eventInfo.Date,
                    startTime: eventInfo.startTime,
                    endTime: eventInfo.endTime,
                    location: eventInfo.location,
                },
                where:{
                    id: event.id,
                    hostId: eventInfo.hostId,
                }
               }) 
               return this.util.dataReponseObject("Event Updated Successfully", 200)
            
        } catch (error) {
            throw new Error(error.message)
        }
    }

    // user delete an event
    async userDeleteEvent(event:{eventId:number, userId: number}){
        try {
            await this.prismaService.event.delete({
                where:{
                    id:event.eventId,
                    hostId: event.userId
                }
            })

            return this.util.dataReponseObject("Event Deleted Successfully", 204)
        } catch (error) {
            throw new Error(error.message)
        }
    }

    // register for an event 
    async userRegisterForEvent(eventInfo:registerEvent){
        
        try {
            await this.prismaService.eventAttendee.create({
                data: {
                    eventId: eventInfo.eventId,
                    attendeeId: eventInfo.attendeeId,
                    status: 'Registered'
                }
            })

            return this.util.dataReponseObject("Registered for the event Successfully", 200)
        } catch (error) {
            throw new Error(error.message)
        }
    }
     
}

