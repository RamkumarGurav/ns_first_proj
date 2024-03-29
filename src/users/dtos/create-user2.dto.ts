import { Exclude, Transform } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
  isNotEmpty,
  isString,
} from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class CreateUserDto2 {
  @IsDefined({ message: 'Name is required' }) // Ensure name property is defined
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name must be a String' })
  @Transform(({ value }) => value.trim()) // Trim whitespace from incoming string
  @MinLength(2, { message: 'Name must be at least 2 characters long' }) // Minimum length of 5 characters
  @MaxLength(200, { message: 'Name must not exceed 200 characters' }) // Minimum length of 5 characters
  name: string;

  @IsDefined({ message: 'Email is required' }) // Ensure name property is defined
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail()
  @Transform(({ value }) => value.trim()) // Trim whitespace from incoming string
  email: string;

  @IsDefined({ message: 'Password is required' }) // Ensure name property is defined
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @Exclude()
  extra: any;
}
