import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  @ApiOkResponse({ description: 'Successfully get current user' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get('')
  async me(@Req() req, @Res() res) {
    return res.status(HttpStatus.OK).json(req.user);
  }
}
