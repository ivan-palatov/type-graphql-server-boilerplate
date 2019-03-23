import { Redis } from 'ioredis';
import { v4 as uuid } from 'uuid';
import { CONFIRM_EMAIL } from '../constants/redisPrefixes';

export const createConfirmationUrl = async (userId: number, redis: Redis) => {
  const token = uuid();
  await redis.set(`${CONFIRM_EMAIL}${token}`, userId, 'ex', 60 * 60 * 24); //1 day

  return `http://localhost:3000/user/confirm/${token}`;
};
