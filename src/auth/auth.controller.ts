import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({ description: 'Successfully logged in' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req, @Res() res) {
    const tokenObj = await this.authService.login(req.user);
    return res.status(HttpStatus.OK).json(tokenObj);
  }

  @ApiOkResponse({ description: 'Successfully get current user' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
