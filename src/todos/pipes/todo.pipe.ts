import { PipeTransform,ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { CreateTodoDto } from "../dto/create-todo.dto";
import { Todo } from "../todo.entity";
import { validate } from "class-validator";

export class TodoPipe implements PipeTransform{
   async transform(value: any, metadata: ArgumentMetadata):Promise<any>{
    console.log(value,typeof(value));
    const todoClass=plainToInstance(CreateTodoDto,value);
    const errors=await validate(todoClass);

    if(errors.length>0){
      throw new BadRequestException("Validation Failed"+JSON.stringify(errors));
    }
    return value;
  }
}