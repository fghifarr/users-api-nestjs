import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { ProfileController } from './profile.controller';

@Module({
  imports: [UserModule],
  providers: [JwtStrategy, UserService],
  controllers: [ProfileController],
})
export class ProfileHttpModule {}
