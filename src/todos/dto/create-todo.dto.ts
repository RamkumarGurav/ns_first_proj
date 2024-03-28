import { IsString, IsBoolean } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  title: string;

  @IsBoolean()
  completed: boolean;
}