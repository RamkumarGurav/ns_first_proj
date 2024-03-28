import { IsBoolean, IsDate, IsDateString, IsString } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'todo' })
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 1 })
  user_id: number;

  @Column()
  @IsString()
  title: string;

  @Column({ default: false })
  @IsBoolean()
  completed: boolean;

  @Column({ default: '1' })
  @IsString()
  status: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  added_on: Date;

  @Column({ type: 'datetime', default: null, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_on: Date;
}
