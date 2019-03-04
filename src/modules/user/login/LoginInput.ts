import { InputType, Field } from 'type-graphql';

import { User } from '../../../entity/User';
import { Length, IsEmail } from 'class-validator';

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(6, 75)
  password: string;
}
