import faker from 'faker';
import { Connection } from 'typeorm';
import { User } from '../../../entity/User';
import { TestClient } from '../../../testUtils/TestClient';
import { testConn } from '../../../testUtils/testConn';

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
