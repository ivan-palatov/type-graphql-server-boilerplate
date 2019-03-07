import { Connection } from 'typeorm';
import faker from 'faker';

import { testConn } from '../../../testUtils/testConn';
import { TestClient } from '../../../testUtils/TestClient';
import { User } from '../../../entity/User';

faker.seed(2);
const email = faker.internet.email();
const password = faker.internet.password();

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

describe('Login', () => {
  it('should login', async () => {
    expect.assertions(2);
    const user = await User.create({
      email,
      password,
      confirmed: true,
      firstName: 'Jon',
      lastName: 'Snow',
    }).save();
    const client = new TestClient();
    const res = await client.login(email, password);
    expect(res.data.login).toEqual({ id: `${user.id}`, email, fullName: 'Jon Snow' });
    expect(res.errors).toBeUndefined();
  });
  it('should not login if credentials are invalid', async () => {
    const email1 = faker.internet.email();
    const password1 = faker.internet.password();
    const client = new TestClient();
    const res1 = await client.login(email, password1);
    const res2 = await client.login(email1, password);
    expect(res1.data).toBeNull();
    expect(res1.errors).not.toBeUndefined();
    expect(res2.data).toBeNull();
    expect(res2.errors).not.toBeUndefined();
  });
  it('should not login if account is not confirmed', async () => {
    expect.assertions(2);
    const email1 = faker.internet.email();
    const password1 = faker.internet.password();
    TestClient.register(email1, password1, 'john', 'hon');
    const client = new TestClient();
    const res = await client.login(email1, password1);
    expect(res.errors).not.toBeUndefined();
    expect(res.data).toBeNull();
  });
});
