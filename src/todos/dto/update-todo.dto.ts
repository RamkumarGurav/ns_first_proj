import { IsString, IsBoolean, isString, IsOptional } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional() // Make the property optional
  @IsString()
  title?: string;

  @IsOptional() // Make the property optional
  @IsBoolean()
  completed?: boolean;

  @IsOptional() // Make the property optional
  @IsString()
  status?: string;

  
}
