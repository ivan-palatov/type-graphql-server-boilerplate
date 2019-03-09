import faker from 'faker';
import { Connection } from 'typeorm';
import { Story } from '../../../entity/Story';
import { TestClient } from '../../../testUtils/TestClient';
import { testConn } from '../../../testUtils/testConn';
import { PaginatedResult } from '../../shared/PaginatedResult';

faker.seed(11);

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

describe('getStories', () => {
  it('should get stories', async () => {
    expect.assertions(6);
    const res = await TestClient.getStories();
    expect(res.data).not.toBeNull();
    expect(res.errors).toBeUndefined();
    const { stories, count }: PaginatedResult = res.data.getStories;
    expect(stories.length).toBe(10);
    const story = await Story.findOne({
      loadRelationIds: { relations: ['tags'] },
      order: { length: 'DESC' },
    });
    expect(stories[0].title).toEqual(story!.title);
    expect(stories[0].tags).toEqual(story!.tags.map(id => `${id}`));
    expect(count).toBeGreaterThanOrEqual(11);
  });
});
