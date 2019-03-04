import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';

import { User } from '../../entity/User';
import { LoginInput } from './login/LoginInput';
import { IContext } from '../../types/IContext';
import { UserInputError } from 'apollo-server-core';

@Resolver()
export class LoginResolver {
  @Mutation(returns => User)
  async login(
    @Arg('data') { email, password }: LoginInput,
    @Ctx() { req }: IContext
  ): Promise<User> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new UserInputError('Invalid email or password');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UserInputError('Invalid email or password');
    }
    if (!user.confirmed) {
      throw new UserInputError('Email confirmation is required');
    }
    req.session!.userId = user.id;
    return user;
  }
}
