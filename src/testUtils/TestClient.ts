import faker from 'faker';
import rp from 'request-promise';
import { Story } from '../entity/Story';
import { Tag } from '../entity/Tag';

const url = 'http://localhost:4000/graphql';
const options = {
  withCredentials: true,
  jar: rp.jar(),
  json: true,
};

export class TestClient {
  options: rp.RequestPromiseOptions;

  constructor() {
    this.options = {
      withCredentials: true,
      jar: rp.jar(),
      json: true,
    };
  }

  static register(email: string, password: string, firstName: string, lastName: string) {
    return rp.post(url, {
      ...options,
      body: {
        query: `
          mutation {
            register(
              data: {
                email: "${email}"
                password: "${password}"
                firstName: "${firstName}"
                lastName: "${lastName}"
              }
            ) {
              id
              email
              fullName
            }
          }`,
      },
    });
  }

  static confirmEmail(token: string) {
    return rp.post(url, {
      ...options,
      body: {
        query: `mutation {
          confirmEmail(token: "${token}") {
            id
            email
            fullName
          }
        }`,
      },
    });
  }

  login(email: string, password: string) {
    return rp.post(url, {
      ...this.options,
      body: {
        query: `mutation {
          login(data: {email: "${email}", password: "${password}"}) {
            id
            email
            fullName
          }
        }`,
      },
    });
  }

  me() {
    return rp.post(url, {
      ...this.options,
      body: {
        query: `{
          me {
            id
            email
            fullName
          }
        }`,
      },
    });
  }

  logout() {
    return rp.post(url, {
      ...this.options,
      body: {
        query: `mutation {
          logout
        }`,
      },
    });
  }

  static changePassword(password: string, token: string) {
    return rp.post(url, {
      ...options,
      body: {
        query: `mutation {
          changePassword(data: {password: "${password}", token: "${token}"}) {
            id
            email
            fullName
          }
        }`,
      },
    });
  }

  static getStory(id: number) {
    return rp.post(url, {
      ...options,
      body: {
        query: `{
          getStory(id: ${id}) {
            id
            title
            description
            tags
          }
        }
        `,
      },
    });
  }

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
          date: new Date(),
          title: faker.lorem.words(4),
          views: 5400,
          tags: tags.filter(tag => faker.random.boolean()),
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
