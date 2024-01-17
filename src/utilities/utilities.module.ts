import { Global, Module } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports:[
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    })
  ],
  providers: [UtilitiesService],
  exports:[UtilitiesService]
})
export class UtilitiesModule {}
