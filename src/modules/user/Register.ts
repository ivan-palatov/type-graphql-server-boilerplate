import { Resolver, Query, Mutation, Arg, FieldResolver, Root } from 'type-graphql';
import { User } from '../../entity/User';

@Resolver(User)
export class RegisterResolver {
  @Query(returns => String)
  hello() {
    return 'hello';
  }

  @FieldResolver()
  fullName(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Mutation(returns => User)
  async register(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<User> {
    const user = await User.create({ firstName, lastName, email, password }).save();
    return user;
  }
}
