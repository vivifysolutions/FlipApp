import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { MailService } from 'src/mail-service/mail-service.service';
import { TwilioModule } from 'src/shared/Twilio/twilio.module';




@Global()
@Module({
  imports:[TwilioModule],
  providers: [AuthService, AuthGuard, MailService],
  controllers: [AuthController],
   exports:[AuthService, AuthGuard, MailService]
})
export class AuthModule {}
