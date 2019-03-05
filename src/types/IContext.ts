import { Redis } from 'ioredis';
import { Request, Response } from 'express';

export interface IContext {
  req: Request;
  res: Response;
  redis: Redis;
}
