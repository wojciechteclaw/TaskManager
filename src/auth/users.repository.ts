import { User } from './user.entity';
import { DataSource, Repository, TypeORMError } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as argon from 'argon2';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  public async createUser(authCredentials: AuthCredentialsDto) {
    const { username, password } = authCredentials;
    const hash = await argon.hash(password);
    const user = this.create({
      username: username,
      password: hash,
    });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  public async isUserValid(
    username: string,
    password: string,
  ): Promise<boolean> {
    const user = await this.findOne({ where: { username } });
    if (!user) return false;
    const isPasswordValid = await argon.verify(user.password, password);
    return isPasswordValid;
  }
}
