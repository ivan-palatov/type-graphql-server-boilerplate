import { InputType, Field } from 'type-graphql';

import { User } from '../../../entity/User';
import { Length, IsEmail } from 'class-validator';
import { isEmailAlreadyUsed } from './isEmailAlreadyUsed';

@InputType()
export class RegisterInput implements Partial<User> {
  @Field()
  @Length(2, 100)
  firstName: string;

  @Field()
  @Length(2, 100)
  lastName: string;

  @Field()
  @IsEmail()
  @isEmailAlreadyUsed()
  email: string;

  @Field()
  @Length(6, 75)
  password: string;
}
