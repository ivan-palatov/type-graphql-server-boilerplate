import { Max, Min } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class Pagination {
  @Field(type => Int)
  @Min(0)
  skip: number;

  @Field(type => Int)
  @Min(10)
  @Max(100)
  take: number;
}
