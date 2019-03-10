import { UserInputError } from 'apollo-server-core';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { Story } from '../../entity/Story';
import { AttachTagsInput } from './inputs/AttachTagsInput';

@Resolver()
export class AttachTagsToStoryResolver {
  @Mutation(returns => Boolean)
  async attachTagsToStory(@Arg('data') { ids, storyId }: AttachTagsInput) {
    try {
      await Story.createQueryBuilder('s')
        .relation('s.tags')
        .of(storyId)
        .add(ids);
      return true;
    } catch {
      throw new UserInputError('Arguments are not valid');
    }
  }
}
