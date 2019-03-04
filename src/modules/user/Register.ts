import { Resolver, Query, Mutation, Arg } from 'type-graphql';

import { User } from '../../entity/User';
import { RegisterInput } from './register/RegisterInput';

@Resolver()
export class RegisterResolver {
  @Query(returns => String)
  hello() {
    return 'hello';
  }

  @Mutation(returns => User)
  async register(@Arg('data') { email, firstName, lastName, password }: RegisterInput): Promise<
    User
  > {
    const user = await User.create({ firstName, lastName, email, password }).save();
    return user;
  }
}
