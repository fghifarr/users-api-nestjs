import { User } from '../user.entity';

export class UserRespDto {
  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
  }

  id: number;
  username: string;
}
