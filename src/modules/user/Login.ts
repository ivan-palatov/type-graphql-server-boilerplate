import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';

import { User } from '../../entity/User';
import { LoginInput } from './login/LoginInput';
import { IContext } from '../../types/IContext';

@Resolver()
export class LoginResolver {
  @Mutation(returns => User, { nullable: true })
  async login(
    @Arg('data') { email, password }: LoginInput,
    @Ctx() { req }: IContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return null;
    }
    req.session!.userId = user.id;
    return user;
  }
}
