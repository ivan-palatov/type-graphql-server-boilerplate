import { Length, Max, Min } from 'class-validator';
import { Field, Float, ID, InputType, Int } from 'type-graphql';
import { SortInput } from '../../shared/SortInput';

@InputType()
export class StorySearchInput extends SortInput {
  @Field({ nullable: true })
  @Length(3, 255)
  title?: string;

  @Field({ defaultValue: false })
  exact: boolean;

  @Field(type => [ID], { nullable: true })
  tagIds?: number[];

  @Field(type => [ID], { nullable: true })
  excludeTagIds?: number[];

  @Field(type => Int, { nullable: true })
  @Min(0)
  minViews?: number;

  @Field(type => Float, { nullable: true })
  @Min(0)
  @Max(99)
  minRating?: number;

  @Field(type => [String], { nullable: true })
  excludeAuthors?: string[];

  @Field(type => Int, { nullable: true })
  @Min(0)
  minLength?: number;

  @Field(type => Int, { nullable: true })
  @Min(100)
  maxLength?: number;
}
