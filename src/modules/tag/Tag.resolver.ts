import { Arg, Authorized, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Story } from '../../entity/Story';
import { Tag } from '../../entity/Tag';
import { PaginatedResult } from '../shared/PaginatedResult';
import { SortInput } from '../shared/SortInput';

@Resolver(of => Tag)
export class TagResolver {
  @FieldResolver(returns => PaginatedResult)
  async stories(
    @Root() tag: Tag,
    @Arg('data') { skip, take, sortBy, sortOrder }: SortInput
  ): Promise<PaginatedResult> {
    const query = Story.createQueryBuilder('s')
      .select(
        's.id, s.title, s.description, s.rating, s.views, s.date, s.length, s.author, ARRAY_AGG(t.id) as tags'
      )
      .innerJoin('story_tags_tag', 'st', 'st."storyId" = s.id')
      .innerJoin('tag', 't', 'st."tagId" = t.id')
      .groupBy('s.id')
      .having(`bool_or(t.id = ${tag.id})`)
      .orderBy(`s.${sortBy}`, sortOrder as any);
    const [count, stories] = await Promise.all([
      query.getCount(),
      query
        .skip(skip)
        .take(take)
        .getRawMany(),
    ]);
    console.log(typeof stories[0].date);
    return { stories, count };
  }

  @Query(returns => [Tag])
  async getTags() {
    return await Tag.find();
  }

  @Query(returns => Tag, { nullable: true })
  async getTag(@Arg('id') id: number) {
    return await Tag.findOne(id);
  }

  @Authorized()
  @Mutation(returns => Tag)
  async addTag(@Arg('name') name: string) {
    return await Tag.create({ name }).save();
  }
}
