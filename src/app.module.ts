import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FacilityModule } from './facility/facility.module';
import { EventModule } from './event/event.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, FacilityModule, EventModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
