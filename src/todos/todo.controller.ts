import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  ValidationPipe,
  UsePipes,
  BadRequestException,
  UseFilters,
  HttpStatus,
  HttpException,
  ForbiddenException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './todo.entity';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoPipe } from './pipes/todo.pipe';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // =============> USING CustomHttpExceptionFilter <==============
  @Get('CustomHttpExceptionFilter') // Route: GET /todos
  welcome(@Res() res: Response): string {
    //======CASE-1
    // throw new HttpException('This is a Bad request error message', HttpStatus.BAD_REQUEST);
    // throw new HttpException(
    //   'This is a FORBIDDEN request error message',
    //   HttpStatus.FORBIDDEN,
    // );
    // throw new HttpException(
    //   'This is a NOT FOUND request error message',
    //   HttpStatus.NOT_FOUND,
    // );
    //======

    //======CASE-2
    // throw new BadRequestException('This is a Bad request error message ');
    // throw new ForbiddenException('You are Not allowd to this action');
    // throw new NotFoundException('Resource Not Found');
    //======

    //======CASE-3
    throw new BadRequestException('Something bad happened', {
      cause: new Error(),
      description: 'Some error description',
    });
    // throw new ForbiddenException('Something bad happened', {
    //   cause: new Error(),
    //   description: 'Some error description',
    // });
    // throw new NotFoundException('Something bad happened', {
    //   cause: new Error(),
    //   description: 'Some error description',
    // });
    //======
    console.log(process.env.MODE);
    return 'HI DE';
  }
  // =======================================

  @Post()
  async create(
    @Body(new ValidationPipe()) createTodoDto: CreateTodoDto,
  ): Promise<{ [key: string]: any }> {
    return this.todoService.create(createTodoDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    if (Object.keys(updateTodoDto).length == 0) {
      throw new BadRequestException("Request Can't be Empty");
    }
    return this.todoService.update(id, updateTodoDto);
  }

  @Get() // Route: GET /todos
  async findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Get('active') // Route: GET /todos/active
  async findAllActive() {
    return this.todoService.findAllActive();
  }

  @Get(':id') // Route: GET /todos/:id
  async findOneById(@Param('id') id: number): Promise<Todo> {
    return this.todoService.findOneById(id);
  }

  @Delete(':id')
  async DeleteOneById(@Param('id') id: number) {
    return this.todoService.deleteOneById(id);
  }

  @Delete(':title')
  async DeleteOneByTitle(@Param('title') title: string) {
    return this.todoService.deleteOneByTitle(title);
  }
}
