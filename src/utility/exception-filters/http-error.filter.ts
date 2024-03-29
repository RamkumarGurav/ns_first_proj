import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

// Define a custom exception filter using NestJS's @Catch decorator
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger: Logger;

  // Constructor to initialize the logger
  constructor() {
    this.logger = new Logger();
  }

  // Implement the catch method required by the ExceptionFilter interface
  catch(exception: Error, host: ArgumentsHost): any {
    // Extract the request, response, and context from the ArgumentsHost
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    // Determine the status code based on the type of exception
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus() // If it's an HttpException, get the status code
        : HttpStatus.INTERNAL_SERVER_ERROR; // Otherwise, default to 500 Internal Server Error

    // Determine the message to be sent in the response
    const message =
      exception instanceof HttpException
        ? exception.message // If it's an HttpException, get the message
        : exception.message; // Otherwise, use a generic message

    // Create error response objects for development and production environments
    const devErrorResponse: any = {
      statusCode,
      status: false,
      message: exception?.message, // Optional: Include the message of the exception
      errorName: exception?.name, // Optional: Include the name of the exception
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
      method: request.method,
      stact: exception?.stack,
    };

    const prodErrorResponse: any = {
      statusCode,
      status: false,
      message,
    };

    // Log the error details
    this.logger.log(
      `request method: ${request.method} request url${request.url}`,
      JSON.stringify(devErrorResponse),
    );

    // Send the appropriate error response based on the environment
    response.status(statusCode).json(
      process.env.NODE_ENV === 'development' // If in development, send detailed error response
        ? devErrorResponse
        : prodErrorResponse, // Otherwise, send simplified error response
    );
  }
}
