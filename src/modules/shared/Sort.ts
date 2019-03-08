import { IsIn } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Pagination } from './Pagination';

@InputType()
export class Sort extends Pagination {
  @Field({ description: 'Allowed values: title, rating, views, length, date' })
  @IsIn(['title', 'rating', 'views', 'length', 'date'])
  sortBy: string;

  @Field({ description: 'Allowed values: DESC, ASC' })
  @IsIn(['DESC', 'ASC'])
  sortOrder: string;
}
