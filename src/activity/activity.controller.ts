import {
  Controller,
  Param,
  Post,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { activitiesDto } from './dto/activityDto';
import { ActivityService } from './activity.service';

@Controller('activity')
export class ActivityController {

  constructor(private activityService: ActivityService){}

  @UseGuards(AuthGuard)
  @Post('register/:activityId')
  userRegisterActivity(@Param('activityId') activityId:string , @Request() req) {
    const user = req.user;
    let payload:activitiesDto = req.body;
    payload = {
      ...payload,
      userId: user.id,
      activityId: +activityId
    }

    return this.activityService.userRegisterActivity(payload)
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:activityId')
  userDeleteActivity(@Param('activityId') activityId:string) {
    return this.activityService.userDeleteActivity(activityId)
  }
}
