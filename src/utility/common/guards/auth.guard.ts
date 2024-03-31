import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  public key: string = 'asdfasdf';
  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    if (request.header('auth-guard-key') == undefined) return false;

    return request.header('auth-guard-key') == this.key;
  }
}
