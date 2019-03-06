import { UserInputError } from 'apollo-server-core';
import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';

import { User } from '../../entity/User';
import { IContext } from '../../types/IContext';
import { FORGOT_PASSWORD } from '../../constants/redisPrefixes';
import { ChangePasswordInput } from './changePassword/ChangePasswordInput';

@Resolver()
export class ChangePasswordResolver {
  @Mutation(returns => User)
  async changePassword(
    @Arg('data') { password, token }: ChangePasswordInput,
    @Ctx() { redis, req }: IContext
  ): Promise<User> {
    const userId = await redis.get(`${FORGOT_PASSWORD}${token}`);
    if (!userId) {
      throw new UserInputError('Invalid token');
    }
    const user = await User.findOne(parseInt(userId));
    if (!user) {
      throw new UserInputError('Invalid token');
    }
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    await redis.del(`${FORGOT_PASSWORD}${token}`);
    req.session!.userId = user.id;
    return user;
  }
}
