import { Resolver, Ctx, Query } from 'type-graphql';

import { User } from '../../entity/User';
import { IContext } from '../../types/IContext';

@Resolver()
export class MeResolver {
  @Query(returns => User, { nullable: true })
  async me(@Ctx() { req }: IContext): Promise<User | null> {
    if (!req.session || !req.session.userId) {
      return null;
    }
    const user = await User.findOne(req.session.userId);
    if (!user) {
      return null;
    }
    req.session!.userId = user.id;
    return user;
  }
}
