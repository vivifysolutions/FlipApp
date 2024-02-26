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
            return events.length > 0 ? this.util.apiResponse("Success", 200, "User events", events  as any) : this.util.apiResponse("Success", 200, "You have no events", [])
        } catch (error) {
            throw new Error(error)
        }
    }
    
    // create an event 
    async userCreateEvent(eventInfo: eventDto) {
        try {
           const receivedConnections =  await this.prismaService.event.create({
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

            return this.util.apiResponse("Success", 200, "Event Created Successfully", receivedConnections  as any)

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
            if(!event) return this.util.apiResponse("Event not Found", 504, "Event Not Found", [])

            if(event.hostId !== eventInfo.hostId) return this.util.apiResponse("Forbiden", 503, "You can only update your event", [])
        
            const updatedPost = await this.prismaService.event.updateMany({
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
               return this.util.apiResponse("Success", 200, "Event updated Successfully", updatedPost  as any)
            
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

            return this.util.apiResponse("Success", 200, "Event develted Successful", [])
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

            return this.util.apiResponse("Success", 200, "Registered for the event Successfully", [])
        } catch (error) {
            throw new Error(error.message)
        }
    }

    // get all the events available 
    async getAllEvents(hostId: number){
        return this.prismaService.event.findMany({
            where:{
                NOT:{
                    hostId: hostId
                }
            }
        })
    }
     
}

