import { InputType, Field } from 'type-graphql';

import { User } from '../../../entity/User';
import { Length } from 'class-validator';

@InputType()
export class ChangePasswordInput implements Partial<User> {
  @Field()
  token: string;

  @Field()
  @Length(6, 75)
  password: string;
}
