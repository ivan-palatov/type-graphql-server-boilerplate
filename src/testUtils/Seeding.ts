import faker from 'faker';
import { Story } from '../entity/Story';
import { Tag } from '../entity/Tag';

export class Seeding {
  static async seedStories(seed: number, amount: number, tags: Tag[]) {
    faker.seed(seed);
    const promises: Promise<any>[] = [];
    for (let i = 0; i <= amount; i++) {
      promises.push(
        Story.create({
          author: faker.internet.userName(),
          description: faker.lorem.sentence(5),
          introduction: faker.lorem.paragraph(),
          link: faker.internet.domainName(),
          rating: faker.random.number({ min: 0, max: 100, precision: 2 }),
          seriesLink: faker.random.boolean() ? faker.internet.domainName() : undefined,
          text: faker.lorem.paragraphs(30),
          date: faker.date.past(),
          title: faker.lorem.words(4),
          views: Math.floor(Math.random() * 100000),
          tags: tags.filter(_ => Math.random() <= 0.2),
        }).save()
      );
    }
    await Promise.all(promises);
  }

  static async seedTags(seed: number, amount: number) {
    faker.seed(seed);
    const promises: Promise<Tag>[] = [];
    for (let i = 0; i <= amount; i++) {
      promises.push(Tag.create({ name: faker.lorem.word() }).save());
    }
    return await Promise.all(promises);
  }
}
