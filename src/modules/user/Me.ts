import { Resolver, Ctx, Query } from 'type-graphql';
import { AuthenticationError, UserInputError } from 'apollo-server-core';

import { User } from '../../entity/User';
import { IContext } from '../../types/IContext';

@Resolver()
export class MeResolver {
  @Query(returns => User)
  async me(@Ctx() { req }: IContext): Promise<User> {
    if (!req.session || !req.session.userId) {
      throw new AuthenticationError('You are not authenticated.');
    }
    const user = await User.findOne(req.session.userId);
    if (!user) {
      throw new UserInputError('Invalid session');
    }
    return user;
  }
}
