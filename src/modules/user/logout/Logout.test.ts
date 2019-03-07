import { Connection } from 'typeorm';
import faker from 'faker';

import { testConn } from '../../../testUtils/testConn';
import { TestClient } from '../../../testUtils/TestClient';
import { User } from '../../../entity/User';

faker.seed(3);
const email = faker.internet.email();
const password = faker.internet.password();

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

describe('Logout', () => {
  it('should logout', async () => {
    expect.assertions(1);
    await User.create({
      email,
      password,
      firstName: 'John',
      lastName: 'Doe',
      confirmed: true,
    }).save();
    const client = new TestClient();
    await client.login(email, password);
    await client.logout();
    const res = await client.me();
    expect(res.data).toBeNull();
  });
});
