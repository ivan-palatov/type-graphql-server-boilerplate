import { InputType, Field } from 'type-graphql';
import { Length } from 'class-validator';

import { User } from '../../../entity/User';

@InputType()
export class ChangePasswordInput implements Partial<User> {
  @Field()
  token: string;

  @Field()
  @Length(6, 75)
  password: string;
}
