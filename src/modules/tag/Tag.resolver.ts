import { Arg, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Story } from '../../entity/Story';
import { Tag } from '../../entity/Tag';
import { makeStories } from '../../utils/makeStories';
import { SortInput } from '../shared/SortInput';

@Resolver(of => Tag)
export class TagResolver {
  @FieldResolver(returns => [Story], { nullable: true })
  async stories(@Root() tag: Tag, @Arg('data') { skip, take, sortBy, sortOrder }: SortInput) {
    // NOTE: Theres probably a better way to do this
    const raw = await Story.createQueryBuilder('s')
      .select(
        's.id, s.title, s.description, s.rating, s.views, s.date, s.length,' +
          ' s.author, s.seriesLink, ARRAY_AGG(t.id) as tags'
      )
      .innerJoin('story_tags_tag', 'st', 'st."storyId" = s.id')
      .innerJoin('tag', 't', 'st."tagId" = t.id')
      .groupBy('s.id')
      .having(`bool_or(t.id = ${tag.id})`)
      .orderBy(`s.${sortBy}`, sortOrder as any)
      .skip(skip)
      .take(take)
      .getRawMany();
    return makeStories(raw);
  }

  @Query(returns => [Tag])
  async getTags() {
    return await Tag.find();
  }

  @Query(returns => Tag, { nullable: true })
  async getTag(@Arg('id') id: number) {
    return await Tag.findOne(id);
  }
}
