import { Length } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import { Story } from '../../../entity/Story';

@InputType()
export class AddStoryInput implements Partial<Story> {
  @Field()
  @Length(3, 255)
  title: string;

  @Field({ nullable: true })
  @Length(10, 255)
  description?: string;

  @Field()
  @Length(1000)
  text: string;

  @Field()
  @Length(2, 150)
  author: string;

  @Field(type => [ID])
  tagIds: number[];
}
