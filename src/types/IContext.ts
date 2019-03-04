import { Redis } from 'ioredis';
import { Request } from 'express';

export interface IContext {
  req: Request;
  redis: Redis;
}
