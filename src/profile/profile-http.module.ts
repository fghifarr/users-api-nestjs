import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { ProfileController } from './profile.controller';

@Module({
  imports: [UserModule],
  providers: [JwtStrategy],
  controllers: [ProfileController],
})
export class ProfileHttpModule {}
