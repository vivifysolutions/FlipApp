export interface activitiesDto {
  activityId?: number;
  activity_name?: string;
  skillLevel:
    | 'Advanced_Level'
    | 'Intermediate_level'
    | 'Beginner_level'
    | 'Newbie';
  playStyle: 'Competitive' | 'Casual';
  userId: number;
}