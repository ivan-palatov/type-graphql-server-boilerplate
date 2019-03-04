import { Request } from 'express';
import { Redis } from 'ioredis';

export interface IContext {
  req: Request;
  redis: Redis;
}
