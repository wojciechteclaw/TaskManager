import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty({
    example: 'user123',
    description: 'Username of the user',
    default: 'user123',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    example: 'ThisIsAStrongPassword123!',
    description: 'Password of the user',
    default: 'ThisIsAStrongPassword123!',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contains at least 1 upper case letter, 1 lower case letter and 1 number or special character',
  })
  password: string;
}
