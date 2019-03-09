import { IsIn, Max, Min } from 'class-validator';
import { Field, ID, InputType, Int } from 'type-graphql';

@InputType()
export class SeekPaginationInput {
  @Field(type => ID, { nullable: true })
  lastId?: number;

  @Field(type => Int, { nullable: true })
  @Min(0)
  lastInOrder?: number;

  @Field({ description: 'Allowed values: title, rating, views, length, date' })
  @IsIn(['title', 'rating', 'views', 'length', 'date'])
  sortBy: string;

  @Field({ description: 'Allowed values: DESC, ASC' })
  @IsIn(['DESC', 'ASC'])
  sortOrder: string;

  @Field(type => Int)
  @Min(10)
  @Max(100)
  take: number;
}
