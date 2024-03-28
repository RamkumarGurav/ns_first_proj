import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { TodoModule } from './todos/todo.module';
import { Todo } from './todos/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'ns_first_proj',
      entities: [User, Todo],
      synchronize: true,
      timezone: 'Asia/Kolkata',
    }),
    TodoModule,
  ],
})
export class AppModule {}
