import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}
  async create(createTodoDto: CreateTodoDto): Promise<{ [key:string]:any}> {

    // Save the new Todo entity to the database
    const savedTodo = await this.todoRepository.save(createTodoDto);

    return {statusCode: 201, status: true, message: "Resource Created successfully", data: savedTodo};
  }

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  async findAllActive(): Promise<Todo[]> {
    return this.todoRepository.find({ where: { status: '1' } });
  }

  async findAllBlocked(): Promise<Todo[]> {
    return this.todoRepository.find({ where: { status: '0' } });
  }

  async findOneById(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOneBy({ id: id });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  async findOneByColumn(columnName: string, columnValue: any): Promise<Todo> {
    const whereCondition = { [columnName]: columnValue };
    const todo = this.todoRepository.findOne({ where: whereCondition });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  async update(
    id: number,
    updateTodoDto: Partial<UpdateTodoDto>,
  ): Promise<Todo> {
    const todo = await this.findOneById(id);
    // Update properties of the todo entity if they are provided in the DTO
    if (updateTodoDto.title !== undefined) {
      todo.title = updateTodoDto.title;
    }
    if (updateTodoDto.completed !== undefined) {
      todo.completed = updateTodoDto.completed;
    }
    if (updateTodoDto.status !== undefined) {
      todo.status = updateTodoDto.status;
    }

    todo.updated_on = new Date();
    // Save the updated todo entity back to the database
    return this.todoRepository.save(todo);
  }

  async deleteOneById(
    id: number,
  ): Promise<{ status: boolean; message: string }> {
    const result = await this.todoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Todo not found');
    }

    return { status: true, message: 'Successfully deleted' };
  }

  async deleteOneByTitle(
    title: string,
  ): Promise<{ status: boolean; message: string }> {
    const todo = await this.findOneByColumn('title', title);
    await this.todoRepository.remove(todo);
    return { status: true, message: 'Successfully deleted' };
  }
}
