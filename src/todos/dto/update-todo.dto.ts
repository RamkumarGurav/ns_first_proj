import { IsString, IsBoolean, isString } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  title: string;

  @IsBoolean()
  completed: boolean;

  @IsString()
  status: string;
}
