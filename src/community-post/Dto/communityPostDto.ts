
import { IsNotEmpty } from 'class-validator';

export class CommunityPostDto {
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: string;
  date: string;
  time: string;
  activity: string;
  postId: number;
  location: string;
}