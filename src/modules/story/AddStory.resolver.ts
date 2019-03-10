import { UserInputError } from 'apollo-server-core';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { Story } from '../../entity/Story';
import { AddStoryInput } from './inputs/AddStoryInput';

@Resolver()
export class AddStoryResolver {
  @Mutation(returns => Story)
  async addStory(@Arg('data') { title, description, author, text, link, tagIds }: AddStoryInput) {
    try {
      const story = await Story.create({ title, description, author, text, link }).save();
      await Story.createQueryBuilder('s')
        .relation('s.tags')
        .of(story)
        .add(tagIds);
      story.tags = tagIds as any;
      return story;
    } catch {
      throw new UserInputError('Arguments are not valid');
    }
  }
}
