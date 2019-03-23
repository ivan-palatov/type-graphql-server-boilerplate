import { AuthenticationError, UserInputError } from 'apollo-server-core';
import { Ctx, Query, Resolver } from 'type-graphql';
import { User } from '../../entity/User';
import { IContext } from '../../types/IContext';

@Resolver()
export class MeResolver {
  @Query(returns => User)
  async me(@Ctx() { req }: IContext): Promise<User> {
    if (!req.session || !req.session.userId) {
      throw new AuthenticationError('not authenticated');
    }
    const user = await User.findOne(req.session.userId);
    if (!user) {
      throw new UserInputError('not authenticated');
    }
    return user;
  }
}
