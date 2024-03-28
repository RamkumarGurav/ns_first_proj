import { IsString, IsBoolean, ValidateNested,Allow,IsNotEmpty } from 'class-validator';


export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

}
