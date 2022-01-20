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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Response } from 'express';
import { HttpExceptionFilter } from 'src/exceptions/http-exception.filter';
import { UserCreateDto } from './dto/user-create.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRespDto } from './dto/user-resp.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({ description: 'Successfully registered the new user' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
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

  @ApiOkResponse({ description: 'Successfully logged in' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
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

  @ApiOkResponse({ description: 'Successfully get user details ' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get(':id')
  async findById(@Param('id') id: string, @Res() res: Response) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new HttpException(
        `Can't find user with user id: ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    res.status(HttpStatus.OK).json(new UserRespDto(user));
  }

  @ApiOkResponse({ description: 'Successfully updated a user' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
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

  @ApiOkResponse({ description: 'Successfully deleted a user' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
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
