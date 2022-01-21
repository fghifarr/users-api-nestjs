import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HttpExceptionFilter } from 'src/exceptions/http-exception.filter';
import { UserUpdateDto } from 'src/user/dto/user-update.dto';
import { UserService } from 'src/user/user.service';

@ApiTags('profile')
@Controller('profile')
@UseFilters(new HttpExceptionFilter())
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ description: 'Successfully get current user' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get('')
  async me(@Req() req, @Res() res) {
    return res.status(HttpStatus.OK).json(req.user);
  }

  @ApiOkResponse({ description: 'Successfully updated the profile' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Put('')
  async update(
    @Req() req,
    @Body() userUpdateReq: UserUpdateDto,
    @Res() res: Response,
  ) {
    const currentUser = req.user;
    if (!currentUser) throw new UnauthorizedException();

    await this.userService.update(currentUser.userId, userUpdateReq);

    res.status(HttpStatus.OK).json({
      message: 'Successfully updated your profile',
    });
  }

  @ApiOkResponse({ description: 'Successfully deactivated the account' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Delete('')
  async deactivate(@Req() req, @Res() res: Response) {
    const currentUser = req.user;
    if (!currentUser) throw new UnauthorizedException();

    await this.userService.deactivate(currentUser.userId);

    res.status(HttpStatus.OK).json({
      message: 'Successfully deactivated your account',
    });
  }
}
