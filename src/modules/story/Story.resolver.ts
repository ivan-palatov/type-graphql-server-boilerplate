import { UserInputError } from 'apollo-server-core';
import { Arg, Query, Resolver } from 'type-graphql';
import { Story } from '../../entity/Story';
import { PaginatedResult } from '../shared/PaginatedResult';
import { Sort } from '../shared/Sort';

@Resolver(of => Story)
export class StoryResolver {
  // @FieldResolver()
  // async tags(@Root() story: Story) {
  //   return await Tag.createQueryBuilder('t')
  //     .select()
  //     .innerJoin('stories_tags_tags', 'st', 'st.storiesId = :storyId', { storyId: story.id })
  //     .getMany();
  // }

  @Query(returns => PaginatedResult)
  async getStories(@Arg('data') { skip, take, sortBy, sortOrder }: Sort): Promise<PaginatedResult> {
    const [stories, count] = await Story.findAndCount({
      select: ['id', 'title', 'description', 'rating', 'views', 'date', 'length', 'author'],
      skip,
      take,
      relations: ['tags'],
      order: { [sortBy]: sortOrder },
    });
    return { stories, count };
  }

  @Query(returns => Story)
  async getStory(@Arg('id') id: number) {
    const story = await Story.findOne(id);
    if (!story) {
      throw new UserInputError('Story with that id not found.');
    }
    return story;
  }
}
