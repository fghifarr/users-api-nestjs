import {
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
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
}
