import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './jwt-payload.interface';
import { IAccessToken } from './access-token.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async signUp(authCredentials: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentials);
  }

  public async deleteUser(username: string) {
    const result = await this.usersRepository.delete({
      username: username,
    });
    if (!result.affected) {
      throw new HttpException(`User with username ${username} not found`, 404);
    }
  }

  public async signIn(
    authCredentials: AuthCredentialsDto,
  ): Promise<IAccessToken> {
    const { username, password } = authCredentials;
    const isUserValid = await this.usersRepository.isUserValid(
      username,
      password,
    );
    if (!isUserValid) {
      throw new UnauthorizedException(
        `Invalid credentials for a user: ${username}`,
      );
    }
    const payload: IJwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
