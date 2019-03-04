import { Redis } from 'ioredis';
import { v4 as uuid } from 'uuid';

export const createConfirmationUrl = async (userId: number, redis: Redis) => {
  const id = uuid();
  await redis.set(id, userId, 'ex', 60 * 60 * 24); //1 day
  
  return `http://localhost:3000/confirm/${id}`;
};
