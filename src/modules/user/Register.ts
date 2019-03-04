import { Resolver, Query, Mutation, Arg, Authorized, Ctx } from 'type-graphql';

import { User } from '../../entity/User';
import { RegisterInput } from './register/RegisterInput';
import { sendEmail } from '../../utils/sendEmail';
import { createConfirmationUrl } from '../../utils/createConfirmationUrl';
import { IContext } from '../../types/IContext';

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
    const user = await User.create({ firstName, lastName, email, password }).save();
    // Send email
    await sendEmail(email, await createConfirmationUrl(user.id, redis));
    return user;
  }
}
