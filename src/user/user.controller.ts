import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseFilters,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionFilter } from 'src/exceptions/http-exception.filter';
import { UserCreateDto } from './dto/user-create.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserService } from './user.service';

@Controller('users')
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  async register(@Body() req: UserCreateDto, @Res() res: Response) {
    const existingUser = await this.userService.findByUsername(req.username);
    if (existingUser) {
      throw new HttpException(
        `${req.username} already have an account`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = await this.userService.create(req);

    res.status(HttpStatus.CREATED).json({
      message: 'Successfully created user: ' + newUser.username,
    });
  }

  @Post('login')
  async login(@Body() req: UserLoginDto, @Res() res: Response) {
    const existingUser = await this.userService.findByUsername(req.username);
    if (!existingUser) {
      throw new HttpException(
        `Can't find user with username: ${req.username}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.login(req);
    if (!user) {
      throw new HttpException(
        'Invalid username / password',
        HttpStatus.BAD_REQUEST,
      );
    }

    res.status(HttpStatus.OK).json({
      message: 'Successfully logged in as: ' + user.username,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Res() res: Response) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new HttpException(
        `Can't find user with user id: ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    res.status(HttpStatus.OK).json(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() req: UserUpdateDto,
    @Res() res: Response,
  ) {
    const existingUser = await this.userService.findById(id);
    if (!existingUser) {
      throw new HttpException(
        `Can't find user with user id: ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.userService.update(id, req);

    res.status(HttpStatus.OK).json({
      message: 'Successfully updated user: ' + req.username,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const existingUser = await this.userService.findById(id);
    if (!existingUser) {
      throw new HttpException(
        `Can't find user with user id: ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.userService.delete(id);

    res.status(HttpStatus.OK).json({
      message: `Successfully deleted user: ${id}`,
    });
  }
}
