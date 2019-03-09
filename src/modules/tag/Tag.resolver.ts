import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Story } from '../../entity/Story';
import { Tag } from '../../entity/Tag';
import { SortInput } from '../shared/SortInput';

@Resolver(of => Tag)
export class TagResolver {
  @FieldResolver()
  async stories(@Root() tag: Tag, @Arg('data') { skip, take, sortBy, sortOrder }: SortInput) {
    return await Story.createQueryBuilder('s')
      .select('s.id, s.title, s.description, s.rating, s.views, s.date, s.length, s.author')
      .innerJoin('s.tags', 'tg', 'tg.id = :id', { id: tag.id })
      .leftJoinAndSelect('s.tags', 'tag')
      .orderBy(sortBy, sortOrder as any)
      .skip(skip)
      .take(take)
      .getMany();
  }

  @Query(returns => [Tag])
  async getTags() {
    return await Tag.find();
  }

  @Query(returns => Tag, { nullable: true })
  async getTag(@Arg('id') id: number) {
    return await Tag.findOne(id);
  }

  @Mutation(returns => Tag)
  async addTag(@Arg('name') name: string) {
    return await Tag.create({ name }).save();
  }
}
