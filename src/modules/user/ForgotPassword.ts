import { UserInputError, ApolloError } from 'apollo-server-core';
import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { v4 as uuid } from 'uuid';

import { User } from '../../entity/User';
import { IContext } from '../../types/IContext';
import { sendForgotPasswordEmail } from '../../utils/sendForgotPasswordEmail';
import { FORGOT_PASSWORD } from '../../constants/redisPrefixes';

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(returns => Boolean)
  async forgotPassword(@Arg('email') email: string, @Ctx() { redis }: IContext): Promise<boolean> {
    const user = await User.findOne({ where: { email }, select: ['id'] });
    if (!user) {
      throw new UserInputError('User with that email does not exist.');
    }
    const token = uuid();
    await redis.set(`${FORGOT_PASSWORD}${token}`, user.id, 'ex', 60 * 20); // 20 minutes
    const url = `http://localhost:3000/change-password/${token}`;
    try {
      await sendForgotPasswordEmail(email, url);
    } catch {
      throw new ApolloError('Cant send email, try again later');
    }

    return true;
  }
}
