export interface ChatInterface {
  id?: number;
  senderId: number;
  receiverId: number;
  content: string;
} 

export interface IFilter{
  unread?: boolean;
  all?: boolean;
}

