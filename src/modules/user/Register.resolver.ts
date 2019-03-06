import { Resolver, Query, Mutation, Arg, Authorized, Ctx } from 'type-graphql';
import { ApolloError } from 'apollo-server-core';

import { User } from '../../entity/User';
import { IContext } from '../../types/IContext';
import { sendEmail } from '../../utils/sendEmail';
import { RegisterInput } from './register/RegisterInput';
import { createConfirmationUrl } from '../../utils/createConfirmationUrl';

@Resolver()
export class RegisterResolver {
  @Authorized()
  @Query(returns => String)
  hello() {
    return 'hello';
  }

  @Mutation(returns => User)
  async register(
    @Arg('data') { email, firstName, lastName, password }: RegisterInput,
    @Ctx() { redis }: IContext
  ) {
    try {
      const user = await User.create({ firstName, lastName, email, password }).save();
      await sendEmail(email, await createConfirmationUrl(user.id, redis));
      return user;
    } catch {
      throw new ApolloError('Something went wrong');
    }
  }
}
