import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class AttachTagsInput {
  @Field(type => ID)
  storyId: number;

  @Field(type => [ID])
  ids: number[];
}
