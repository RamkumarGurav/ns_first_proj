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
import { UpdateUserDto } from './dtos/udpate-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createOne(createUserDto: CreateUserDto) {
    // Attempt to save the user entity
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user); 
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    const question = await this.usersRepository.findOneBy({ id: id });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Iterate over each property in the update DTO
    for (const key of Object.keys(updateUserDto)) {
      // Check if the property exists in the question entity
      if (key in question) {
        // Update the property value
        question[key] = UpdateUserDto[key];
      } else {
        // If the property doesn't exist in the question entity, throw BadRequestException
        throw new BadRequestException(`Invalid property: ${key}`);
      }
    }

    // Save the updated question entity
    return await this.usersRepository.save(question);
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
