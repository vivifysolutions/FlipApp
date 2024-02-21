import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleGuard } from './RoleGuard';

@Module({
  providers: [UserService, RoleGuard],
  controllers: [UserController]
})
export class UserModule {}
