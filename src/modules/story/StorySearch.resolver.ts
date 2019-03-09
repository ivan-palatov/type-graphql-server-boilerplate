import { Arg, Query, Resolver } from 'type-graphql';
import { Story } from '../../entity/Story';
import { PaginatedResult } from '../shared/PaginatedResult';
import { StorySearchInput } from './inputs/StorySearchInput';

@Resolver()
export class StorySearchResolver {
  @Query(returns => PaginatedResult)
  async searchStories(@Arg('data')
  {
    title,
    exact,
    tagIds,
    excludeTagIds,
    excludeAuthors,
    minLength,
    maxLength,
    minRating,
    minViews,
    skip,
    take,
    sortBy,
    sortOrder,
  }: StorySearchInput) {
    let query = Story.createQueryBuilder('s')
      .select(
        's.id, s.title, s.description, s.rating, s.views, s.date, s.length, s.author, ARRAY_AGG(t.name) as tags'
      )
      .innerJoin('story_tag_tags', 'st', 'st."storyId" = s.id')
      .innerJoin('tag', 't', 'st."tagId" = t.id');
    let touched: boolean = false;
    if (title) {
      query = query.where(`s.title ${exact ? 'ILIKE' : '='} :title`, { title: `%${title}%` });
      touched = true;
    }
    if (minRating && touched) {
      query = query.andWhere('s.rating >= :minRating', { minRating });
    } else if (minRating) {
      query = query.where('s.rating >= :minRating', { minRating });
      touched = true;
    }
    if (minViews && touched) {
      query = query.andWhere('s.views >= :minViews', { minViews });
    } else if (minViews) {
      query = query.where('s.views >= :minViews', { minViews });
      touched = true;
    }
    if (minLength && touched) {
      query = query.andWhere('s.length >= :minLength', { minLength });
    } else if (minLength) {
      query = query.where('s.length >= :minLength', { minLength });
      touched = true;
    }
    if (maxLength && touched) {
      query = query.andWhere('s.length <= :maxLength', { maxLength });
    } else if (maxLength) {
      query = query.where('s.length <= :maxLength', { maxLength });
      touched = true;
    }
    if (excludeAuthors && excludeAuthors.length > 0 && touched) {
      query = query.andWhere('s.author IN (:...authors)', { authors: excludeAuthors });
    } else if (excludeAuthors && excludeAuthors.length > 0) {
      query = query.where('s.author IN (:...authors)', { authors: excludeAuthors });
    }
    query = query.groupBy('s.id');
    touched = false;
    if (tagIds && tagIds.length > 1) {
      query = query.having('t.id IN (:...tagIds)', { tagIds });
      touched = true;
    } else if (tagIds && tagIds.length > 0) {
      query = query.having('t.id = tagId', { tagId: tagIds[0] });
      touched = true;
    }
    if (touched) {
      if (excludeTagIds && excludeTagIds.length > 1) {
        query = query.andHaving('t.id NOT IN (:...excludeTagIds)', { excludeTagIds });
      } else if (excludeTagIds && excludeTagIds.length > 0) {
        query = query.andHaving('t.id != excludeTagId', { excludeTagId: excludeTagIds[0] });
      }
    } else {
      if (excludeTagIds && excludeTagIds.length > 1) {
        query = query.having('t.id NOT IN (:...excludeTagIds)', { excludeTagIds });
      } else if (excludeTagIds && excludeTagIds.length > 0) {
        query = query.having('t.id != excludeTagId', { excludeTagId: excludeTagIds[0] });
      }
    }
    query
      .orderBy(sortBy, sortOrder as any)
      .skip(skip)
      .take(take)
      .getRawMany();
  }
}
