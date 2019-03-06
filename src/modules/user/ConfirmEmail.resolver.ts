import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { UserInputError, ApolloError } from 'apollo-server-core';

import { User } from '../../entity/User';
import { IContext } from '../../types/IContext';
import { CONFIRM_EMAIL } from '../../constants/redisPrefixes';

@Resolver()
export class ConfirmEmailResolver {
  @Mutation(returns => User)
  async confirmEmail(@Arg('token') token: string, @Ctx() { redis, req }: IContext): Promise<User> {
    const userId = await redis.get(`${CONFIRM_EMAIL}${token}`);
    if (!userId) {
      throw new UserInputError('Invalid token');
    }
    try {
      const user = await User.findOne(parseInt(userId));
      user!.confirmed = true;
      await user!.save();
      await redis.del(`${CONFIRM_EMAIL}${token}`);
      req.session!.userId = user!.id;
      return user!;
    } catch {
      throw new ApolloError('Something went wrong');
    }
  }
}
