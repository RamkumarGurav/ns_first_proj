import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import {
  instanceToPlain,
  plainToClass,
  plainToInstance,
} from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserExtraDto } from './dtos/create-user-extra.dto';
import { Response } from 'express';
import { HttpErrorFilter } from 'src/utility/common/exception-filters/http-error.filter';
import { AuthGuard } from 'src/utility/common/guards/auth.guard';
import { NullToStringInterceptor } from 'src/utility/common/interceptors/nulltostring';
import { UpdateUserDto } from './dtos/udpate-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('welcome')
  @UseGuards(new AuthGuard())
  @UseInterceptors(new NullToStringInterceptor())
  welcome() {
    return null;
  }

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

  @Post('case1/with-extra')
  async createOne1(@Body() body: any, @Res() res: Response) {
    // =============> handling extra req props <==============
    let dummyUrl = body.extra && body.extra.url;
    console.log(dummyUrl);
    // throw new NotFoundException('NOT FOINDconst');

    // =======================================

    // =============> converting req body to dto and validating <==============
    const validatedCreateUserDto = plainToInstance(CreateUserExtraDto, body); //" excludeExtraneousValues: true," this removes the extra props from the req
    console.log(validatedCreateUserDto);
    // Validate the transformed object
    const validationErrors = await validate(validatedCreateUserDto);
    if (validationErrors.length > 0) {
      // Extract error messages from validationErrors
      let errorObj = {};
      validationErrors.forEach((error) => {
        errorObj[error.property] = Object.values(error.constraints)[0];
      });

      // Throw a BadRequestException with error messages
      throw new BadRequestException({
        message: errorObj,
        errorType: 'Validation Error',
        statusCode: 400,
      });
      // throw new BadRequestException(errorMessages[0]);
    }

    // =======================================

    // =============> passing validated dto to service <==============
    const newUser = await this.usersService.createOne(validatedCreateUserDto);
    // =======================================

    // =============> sending response <==============
    return res.status(201).json({
      statusCode: 201,
      status: true,
      message: 'Successfully Created the User',
      data: newUser,
    });
  }

  @Post('case2/without-extra')
  // @UsePipes(new ValidationPipe({ whitelist: true })) //this removes the extra props from the req body
  async createOne2(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    // =============> passing validated dto to service <==============
    const newUser = await this.usersService.createOne(createUserDto);
    // =======================================

    // =============> sending response <==============
    return res.status(201).json({
      statusCode: 201,
      status: true,
      message: 'Successfully Created the User',
      data: newUser,
    });
    // ===========================
  }

  @Put(':id')
  async updateOne1(
    @Param('id') id: number,
    @Body() body: any,
    @Res() res: Response,
  ) {
    // =============> handling extra req props <==============
    let dummyUrl = body.extra && body.extra.url;
    console.log(dummyUrl);
    // =======================================

    // =============> converting req body to dto and validating <==============
    const validatedUpdateUserDto = plainToInstance(UpdateUserDto, body); //" excludeExtraneousValues: true," this removes the extra props from the req
    console.log(validatedUpdateUserDto);

    // Validate the transformed object
    const validationErrors = await validate(validatedUpdateUserDto);
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

    // =============> passing validated dto to service <==============
    const user = await this.usersService.updateOne(id, validatedUpdateUserDto);
    // =======================================

    // =============> sending response <==============
    return res.status(200).json({
      statusCode: 200,
      status: true,
      message: 'Successfully Updated the User',
      data: user,
    });
    // ===========================
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
