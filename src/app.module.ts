import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      useFactory: (_) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        url: 'postgresql://wojciecht:jakieshaslo@localhost:5434/task-manager?schema=public',
      }),
    }),
    AuthModule,
  ],
})
export class AppModule {}
