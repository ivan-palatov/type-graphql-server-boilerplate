import { Field, Int, ObjectType } from 'type-graphql';
import { Story } from '../../entity/Story';

@ObjectType()
export class PaginatedResult {
  @Field(type => [Story], { nullable: true })
  stories: Story[];

  @Field(type => Int)
  count: number;
}
