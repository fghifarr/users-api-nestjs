import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, ValidateIf } from 'class-validator';

export class UserUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  username: string;

  @ApiPropertyOptional()
  password: string;
}
