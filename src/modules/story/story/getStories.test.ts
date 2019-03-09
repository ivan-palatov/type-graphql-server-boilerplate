import faker from 'faker';
import { Connection } from 'typeorm';
import { testConn } from '../../../testUtils/testConn';

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
    expect.assertions(2);
  });
});
