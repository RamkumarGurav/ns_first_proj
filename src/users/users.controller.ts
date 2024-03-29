import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto2 } from './dtos/create-user2.dto';
import { Response } from 'express';
import { HttpErrorFilter } from 'src/utility/exception-filters/http-error.filter';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('test1')
  @UseFilters(HttpErrorFilter)
  test1() {
    // throw new Error('TEST ERROR');
    // throw new InternalServerErrorException(
    //   'InternalServerErrorException happened',
    // );
    throw new BadRequestException('This is Bad request message');

    return 'TEST TEST';
  }

  // =============> CRUD <==============

  @Post('case1/without-extra')
  @UsePipes(new ValidationPipe({ whitelist: true })) //this removes the extra props from the req body
  async createOne1(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return createUserDto;

    // =============> REQ1 <==============
    // {
    //   "name": "user1 ",
    //     "email":"user1@gmail.com ",
    //     "password":"asdfasdf",
    //     "extra":"this is extra"
    // }
    // =============> RES1 <==============
    // {
    //   "name": "user1",
    //     "email":"user1@gmail.com",
    //     "password":"asdfasdf",
    // }
    // =============> REQ2 <==============
    //   {
    //     "email":"user1@gmail.com  ",
    //     "password":"asdfasdf",
    //     "extra":"this is extra"
    // }
    // =============> RES2 <==============
    //   {
    //     "message": [
    //         "Name is required",
    //         "Name must not exceed 200 characters",
    //         "Name must be at least 2 characters long",
    //         "Name must be a String",
    //         "Name should not be empty"
    //     ],
    //     "error": "Bad Request",
    //     "statusCode": 400
    // }
  }

  @Post('case2/with-extra')
  async createOne2(@Body() body: any, @Res() res: Response) {
    try {
      let dummyUrl = body.extra && body.extra.url;
      console.log(dummyUrl);
      const validatedCreateUserDto = plainToInstance(CreateUserDto2, body); //" excludeExtraneousValues: true," this removes the extra props from the req
      // Validate the transformed object
      const validationErrors = await validate(validatedCreateUserDto);
      if (validationErrors.length > 0) {
        // Extract error messages from validationErrors
        const errorMessages = validationErrors
          .map((error) => Object.values(error.constraints))
          .flat();

        // Throw a BadRequestException with error messages
        throw new BadRequestException({
          message: errorMessages,
          error: 'Bad Request',
          statusCode: 400,
        });
      }
      // Attempt to save the user entity

      // Attempt to save the user entity
      // throw new InternalServerErrorException('Soory:');
      const newUser = this.usersService.createOne(validatedCreateUserDto);
      return res.status(201).json({
        statusCode: 201,
        status: true,
        message: 'Successfully Created the User',
        data: newUser,
      });
    } catch (error) {
      throw new Error('hi');
    }

    // =============> REQ1 <==============
    // {
    //   "name": "user1 ",
    //     "email":"user1@gmail.com ",
    //     "password":"asdfasdf",
    //       "extra":{"url":"dummy.com"}
    // }
    // =============> RES1 <==============
    // {
    //   "name": "user1",
    //     "email":"user1@gmail.com",
    //     "password":"asdfasdf",
    // }
    // =============> REQ2 <==============
    //   {
    //     "email":"user1@gmail.com  ",
    //     "password":"asdfasdf",
    //     "extra":"this is extra"
    // }
    // =============> RES2 <==============
    //   {
    //     "message": [
    //         "Name is required",
    //         "Name must not exceed 200 characters",
    //         "Name must be at least 2 characters long",
    //         "Name must be a String",
    //         "Name should not be empty"
    //     ],
    //     "error": "Bad Request",
    //     "statusCode": 400
    // }
  }

  @Get()
  async findAll(@Query() queryParams: any, @Res() res: Response): Promise<any> {
    console.log(queryParams);
    let where = {};
    let pageNumber = 1;
    let pageSize = 100;
    let orderObj = { id: 'DESC' };
    if (queryParams.page) {
      pageNumber = queryParams.page;
    }
    if (queryParams.limit) {
      pageSize = queryParams.limit;
    }

    if (queryParams.orderBy && queryParams.order) {
      delete orderObj.id;
      orderObj[queryParams.orderBy] = queryParams.order;
    }
    if (queryParams.cn && queryParams.cv) {
      where[queryParams.cn] = queryParams.cv;
    }

    const users = await this.usersService.findAll(
      pageNumber,
      pageSize,
      orderObj,
      where,
    );

    console.log(where);

    res.status(200).json({
      statusCode: 200,
      status: true,
      count: users.data.length,
      ...users,
    });
  }

  @Get('search')
  async search(@Query() queryParams: any, @Res() res: Response): Promise<any> {
    let where = {};
    let pageNumber = 1;
    let pageSize = 100;
    let orderObj = { id: 'DESC' };
    if (queryParams.page) {
      pageNumber = queryParams.page;
    }
    if (queryParams.limit) {
      pageSize = queryParams.limit;
    }

    if (queryParams.orderBy && queryParams.order) {
      delete orderObj.id;
      orderObj[queryParams.orderBy] = queryParams.order;
    }
    if (queryParams.cn && queryParams.cv) {
      where[queryParams.cn] = queryParams.cv;
    }

    const users = await this.usersService.search(
      pageNumber,
      pageSize,
      orderObj,
      where,
      queryParams.search,
    );

    console.log(where);

    res.status(200).json({
      statusCode: 200,
      status: true,
      count: users.data.length,
      ...users,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    res.status(200).json({
      statusCode: 200,
      status: true,
      data: user,
    });
  }
}
