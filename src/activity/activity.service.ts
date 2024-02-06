import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { activitiesDto } from './dto/activityDto';
import { UtilitiesService } from 'src/utilities/utilities.service';

@Injectable()
export class ActivityService {
    constructor(private prisma: PrismaService, private util: UtilitiesService) { }

    // user register and activity 
    async userRegisterActivity(activity: activitiesDto) {

        try {
            const findActivity = await this.prisma.activity.findFirst({
                where: {
                    id: activity.activityId
                }
            })
            if (!findActivity) {
                return new HttpException("Activity not found", HttpStatus.NOT_FOUND)
            }

            await this.prisma.userActivity.create({
                data: {
                    activity_id: activity.activityId,
                    activity_name: findActivity.name,
                    userId: activity.userId,
                    playStyle: activity.playStyle,
                    skillLevel: activity.skillLevel,
                }
            })
            return this.util.dataReponseObject("You have sucessfully registered for the event", 200);

        } catch (error) {
            throw new Error(error)
        }
    }
    // user delete an activity 
    async userDeleteActivity(activityId: any) {
        try {
            await this.prisma.userActivity.delete({
                where: {
                    id: +activityId
                }
            })
            return this.util.dataReponseObject("Activity deleted successfully", 200);
        } catch (error) {
            throw new Error(error.message)
        }
     }
}
