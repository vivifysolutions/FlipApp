import { IsNotEmpty } from 'class-validator';

export interface eventDto {
  id?: number;
  title: string;
  Date: Date;
  description?: string;
  status?: string;
  hostId: number;
  startTime: Date;
  endTime: Date;
  attendees?: evenAttendee[];
  location: string;
} 

  export interface evenAttendee{
    id: number
    firstName: string
    lastName: string
    photoUrl: string
  } 
  export interface registerEvent{
    eventId: number;
    attendeeId: number;
  }


  export class EventCreateDto{
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    Date: Date;
    @IsNotEmpty()
    description?: string;
    status?: string;
    hostId: number;
    @IsNotEmpty()
    startTime: Date;
    @IsNotEmpty()
    endTime: Date;
    attendees?: evenAttendee[];
    @IsNotEmpty()
    location: string;
  }
