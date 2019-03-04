import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';

import { User } from '../../entity/User';
import { IContext } from '../../types/IContext';
import { UserInputError } from 'apollo-server-core';

@Resolver()
export class ConfirmEmailResolver {
  @Mutation(returns => Boolean)
  async confirmEmail(
    @Arg('token') token: string,
    @Ctx() { redis }: IContext
  ): Promise<boolean> {
    const userId = await redis.get(token);
    if (!userId) {
      throw new UserInputError('Invalid token');
    }
    try {
      await User.update({ id: parseInt(userId) }, { confirmed: true });
      await redis.del(token);
      return true;
    } catch {
      return false;
    }
  }
}
