import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { TodoModule } from './todos/todo.module';
import { Todo } from './todos/todo.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from './utility/common/exception-filters/http-error.filter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'ns_first_proj_db',
      entities: [User, Todo],
      synchronize: true,
      timezone: 'Asia/Kolkata',
    }),
    TodoModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule {}
