import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Like, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createOne(createUserDto: CreateUserDto) {
    // Attempt to save the user entity

    // Attempt to save the user entity
    const newUser = await this.usersRepository.save(createUserDto);
    throw new NotFoundException('Resource NOt Found');
    return newUser;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findOne(id: number): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id: id });
  }

  findAll1(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findAll(
    pageNumber: number = 1, // Default page number 1
    pageSize: number = 100, // Default page size 100
    orderObj: any, // Default order
    // username: string = '', // Default empty string
    where: { [key: string]: any } = {},
  ): Promise<{ data: User[]; totalCount: number }> {
    const skip = (pageNumber - 1) * pageSize;
    const [users, totalCount] = await this.usersRepository.findAndCount({
      where: where, // Conditionally apply search condition
      order: orderObj,
      take: pageSize,
      skip,
    });
    return { data: users, totalCount: totalCount };
  }

  async search(
    pageNumber: number = 1, // Default page number 1
    pageSize: number = 100, // Default page size 100
    orderObj: any, // Default order
    // username: string = '', // Default empty string
    where: { [key: string]: any } = {},
    name: any,
  ): Promise<{ data: User[]; totalCount: number }> {
    const skip = (pageNumber - 1) * pageSize;
    const [users, totalCount] = await this.usersRepository.findAndCount({
      // where: { name: { like: `%${q}%` }, ...where }, // Conditionally apply search condition
      where: name ? { name: Like(`%${name}%`), ...where } : { ...where },
      order: orderObj,
      take: pageSize,
      skip,
    });
    return { data: users, totalCount: totalCount };
  }
}
