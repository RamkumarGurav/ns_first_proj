import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<any> {
    return this.usersService.findAll();
  }

  @Get()
  sayHello(): string {
    return 'Hello Guys';
  }
}
