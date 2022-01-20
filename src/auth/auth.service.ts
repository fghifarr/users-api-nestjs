import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    const isPassMatch = await bcrypt.compare(pass, user.password);
    if (user && isPassMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
