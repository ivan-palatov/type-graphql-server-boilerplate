import { UserInputError } from 'apollo-server-core';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Story } from '../../entity/Story';
import { PaginatedResult } from '../shared/PaginatedResult';
import { SeekPaginationInput } from '../shared/SeekPaginationInput';
import { SortInput } from '../shared/SortInput';
import { AddStoryInput } from './inputs/AddStoryInput';
import { AttachTagsInput } from './inputs/AttachTagsInput';

@Resolver(of => Story)
export class StoryResolver {
  // @FieldResolver()
  // async tags(@Root() story: Story) {
  //   return await Tag.createQueryBuilder('t')
  //     .select()
  //     .innerJoin('stories_tags_tags', 'st', 'st.storiesId = :storyId', { storyId: story.id })
  //     .getMany();
  // }

  @Query(returns => Story)
  async getStory(@Arg('id') id: number) {
    const story = await Story.findOne(id, { loadRelationIds: { relations: ['tags'] } });
    if (!story) {
      throw new UserInputError('Story with that id not found.');
    }
    return story;
  }

  @Query(returns => PaginatedResult)
  async getStories(@Arg('data') { skip, take, sortBy, sortOrder }: SortInput): Promise<
    PaginatedResult
  > {
    const [stories, count] = await Story.findAndCount({
      select: ['id', 'title', 'description', 'rating', 'views', 'date', 'length', 'author'],
      skip,
      take,
      loadRelationIds: { relations: ['tags'] },
      order: { [sortBy]: sortOrder },
    });
    return { stories, count };
  }

  @Query(returns => [Story])
  async getStoriesBySeek(@Arg('data')
  {
    lastId,
    lastInOrder,
    sortBy,
    sortOrder,
    take,
  }: SeekPaginationInput) {
    const query = Story.createQueryBuilder('s')
      .select('s.id, s.title, s.description, s.rating, s.views, s.date, s.length, s.author')
      .loadAllRelationIds({ relations: ['s.tags'] });
    // If first time fetching
    if (!lastId || !lastInOrder) {
      return await query
        .orderBy(`s.${sortBy} ${sortOrder}, s.id ${sortOrder}`)
        .take(take)
        .getMany();
    }
    // If fetching more than once
    const where = `(s.${sortBy}, s.id) ${sortOrder === 'DESC' ? '<' : '>'} (:lastInOrder, :lastId)`;
    return await query
      .where(where, { lastInOrder, lastId })
      .orderBy(`s.${sortBy} ${sortOrder}, s.id ${sortOrder}`)
      .take(take)
      .getMany();
  }

  @Query(returns => [Story])
  async getStoriesByAuthor(@Arg('author') author: string) {
    const stories = await Story.find({
      select: ['id', 'title', 'description', 'rating', 'views', 'date', 'length', 'author'],
      loadRelationIds: { relations: ['tags'] },
      where: { author },
    });
    if (stories.length === 0) {
      throw new UserInputError('Author does not exist');
    }
    return stories;
  }

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
