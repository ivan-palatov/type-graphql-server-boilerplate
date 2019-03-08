import { IsIn } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { PaginationInput } from './PaginationInput';

@InputType()
export class SortInput extends PaginationInput {
  @Field({ description: 'Allowed values: title, rating, views, length, date' })
  @IsIn(['title', 'rating', 'views', 'length', 'date'])
  sortBy: string;

  @Field({ description: 'Allowed values: DESC, ASC' })
  @IsIn(['DESC', 'ASC'])
  sortOrder: string;
}
