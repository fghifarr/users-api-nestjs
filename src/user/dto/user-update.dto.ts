import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserUpdateDto {
  @ApiPropertyOptional()
  username: string;
  @ApiPropertyOptional()
  password: string;
}
