import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IAccessToken } from './access-token.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signin')
  @ApiCreatedResponse({ description: 'User signed in' })
  @ApiConflictResponse({ description: 'User already exists' })
  public async signUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    await this.authService.signUp(authCredentialsDto);
  }

  @Delete('/:username')
  @ApiOkResponse({ description: 'User deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  public async deleteUser(@Param('username') username: string): Promise<void> {
    await this.authService.deleteUser(username);
  }

  @Post('/signup')
  @ApiCreatedResponse({ description: 'User signed up' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  public async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<IAccessToken> {
    return await this.authService.signIn(authCredentialsDto);
  }
}
