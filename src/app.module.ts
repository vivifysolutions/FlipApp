import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FacilityModule } from './facility/facility.module';
import { EventModule } from './event/event.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UtilitiesModule } from './utilities/utilities.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ActivityModule } from './activity/activity.module';
import { ConnectionsModule } from './connections/connections.module';
import { ChatModule } from './chat/chat.module';
import { ChatGateWay } from './chat/chat.gateway';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
  MailerModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (config: ConfigService) => ({
      transport: {
        host: config.get('SES_HOST'),
        port: config.get('SES_PORT'),
        ignoreTLS: false,
        secure: false,
        auth: {
          user: config.get('SES_SMTP_USERNAME'),
          pass: config.get('SES_SMTP_PASSWORD')
        }
      },
      preview: false,
      template: {
        dir: process.cwd() + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        }
      }
    }),
    inject: [ConfigService]
  }), AuthModule, UserModule, FacilityModule, EventModule,
    PrismaModule, UtilitiesModule, 
    ActivityModule, ConnectionsModule, ChatModule],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule { }
