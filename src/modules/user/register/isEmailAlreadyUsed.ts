import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { User } from '../../../entity/User';

@ValidatorConstraint({ async: true })
class isEmailAlreadyUsedConstraint implements ValidatorConstraintInterface {
  async validate(email: string) {
    const user = await User.findOne({ where: { email }, select: ['id'] });
    if (user) return false;
    return true;
  }

  defaultMessage() {
    return `User with this $property already exists.`;
  }
}

export function isEmailAlreadyUsed(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: isEmailAlreadyUsedConstraint,
    });
  };
}
