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
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './todo.entity';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoPipe } from './pipes/todo.pipe';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('welcome') // Route: GET /todos
  welcome(): string {
    return 'Welcome to Todos API';
  }



  @Post()
  async create(@Body(new ValidationPipe()) createTodoDto: CreateTodoDto): Promise<{ [key:string]:any}> {
    return this.todoService.create(createTodoDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    if(Object.keys(updateTodoDto).length==0){
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
