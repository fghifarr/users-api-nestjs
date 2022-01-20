import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/user-create.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({ username: username });
  }

  async create(userReq: UserCreateDto) {
    const saltOrRounds = 10;
    const hashPass = await bcrypt.hash(userReq.password, saltOrRounds);

    return await this.userRepository.save({
      username: userReq.username,
      password: hashPass,
    });
  }

  async login(loginReq: UserLoginDto): Promise<User> {
    const user = await this.userRepository.findOne({
      username: loginReq.username,
      password: loginReq.password,
    });

    return user;
  }

  async list(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new HttpException(
        `Cannot find user with id: ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  async update(id: string, userReq: UserUpdateDto) {
    const partialEntity = {};
    if (userReq.username != null) partialEntity['username'] = userReq.username;
    if (userReq.password != null) partialEntity['password'] = userReq.password;

    await this.userRepository.update(id, partialEntity);
  }

  async delete(id: string) {
    const user = await this.userRepository.delete(id);
    console.log(user);

    if (!user) {
      throw new HttpException(
        `Cannot find user with id: ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
