import { testConn } from '../../../testUtils/testConn';
import { Connection } from 'typeorm';
import { TestClient } from '../../../testUtils/TestClient';

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

describe('Register', () => {
  it('should create user', async () => {
    await TestClient.register('test@test.com', '123test', 'John', 'Smith');
  });
});
