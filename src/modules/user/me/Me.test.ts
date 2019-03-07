import { Connection } from 'typeorm';
import faker from 'faker';

import { testConn } from '../../../testUtils/testConn';
import { TestClient } from '../../../testUtils/TestClient';
import { User } from '../../../entity/User';

faker.seed(4);
const email = faker.internet.email();
const password = faker.internet.password();

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

describe('Me', () => {
  const client = new TestClient();
  it('should return logined user', async () => {
    expect.assertions(2);
    await User.create({
      email,
      password,
      confirmed: true,
      firstName: 'Jane',
      lastName: 'Doe',
    }).save();
    await client.login(email, password);
    const res = await client.me();
    expect(res.data).not.toBeNull();
    expect(res.errors).toBeUndefined();
  });
  it('should return error if user is not logged in', async () => {
    expect.assertions(2);
    await client.logout();
    const res = await client.me();
    expect(res.data).toBeNull();
    expect(res.errors).not.toBeUndefined();
  });
});
