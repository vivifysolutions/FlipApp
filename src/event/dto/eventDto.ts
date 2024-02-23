import { IsNotEmpty } from 'class-validator';

export interface eventDto {
  id?: number;
  title: string;
  Date: string;
  description?: string;
  status?: string;
  hostId: number;
  startTime: string;
  endTime: string;
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
    Date: string;
    @IsNotEmpty()
    description?: string;
    status?: string;
    hostId: number;
    @IsNotEmpty()
    startTime: string;
    @IsNotEmpty()
    endTime: string;
    attendees?: evenAttendee[];
    @IsNotEmpty()
    location: string;
  }
