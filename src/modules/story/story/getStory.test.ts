import faker from 'faker';
import { Connection } from 'typeorm';
import { Story } from '../../../entity/Story';
import { Tag } from '../../../entity/Tag';
import { TestClient } from '../../../testUtils/TestClient';
import { testConn } from '../../../testUtils/testConn';

faker.seed(10);

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

describe('getStory', () => {
  it('should get story', async () => {
    expect.assertions(2);
    const story = await Story.create({
      author: faker.internet.userName(),
      description: faker.lorem.sentence(5),
      introduction: faker.lorem.paragraph(),
      link: faker.internet.domainName(),
      rating: faker.random.number({ min: 0, max: 100, precision: 2 }),
      seriesLink: faker.random.boolean() ? faker.internet.domainName() : undefined,
      text: faker.lorem.paragraphs(30),
      date: new Date(),
      title: faker.lorem.words(4),
      views: 5400,
    }).save();
    const res = await TestClient.getStory(story.id);
    expect(res.data).not.toBeNull();
    expect(res.data.getStory).toEqual({
      id: `${story.id}`,
      title: story.title,
      description: story.description,
      tags: [],
    });
  });
  it('should get story with tags', async () => {
    expect.assertions(2);
    const tag1 = await Tag.create({ name: 'tag1' }).save();
    await Tag.create({ name: 'tag2' }).save();
    const tag3 = await Tag.create({ name: 'tag3' }).save();
    const story = await Story.create({
      author: faker.internet.userName(),
      description: faker.lorem.sentence(5),
      introduction: faker.lorem.paragraph(),
      link: faker.internet.domainName(),
      rating: faker.random.number({ min: 0, max: 100, precision: 2 }),
      seriesLink: faker.random.boolean() ? faker.internet.domainName() : undefined,
      text: faker.lorem.paragraphs(30),
      date: new Date(),
      title: faker.lorem.words(4),
      views: 5400,
      tags: [tag1, tag3],
    }).save();
    const res = await TestClient.getStory(story.id);
    expect(res.data).not.toBeNull();
    expect(res.data.getStory).toEqual({
      id: `${story.id}`,
      title: story.title,
      description: story.description,
      tags: [`${tag1.id}`, `${tag3.id}`],
    });
  });
});
