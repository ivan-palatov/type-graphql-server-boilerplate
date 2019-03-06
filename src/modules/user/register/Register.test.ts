import { Connection } from 'typeorm';
import faker from 'faker';
import bcrypt from 'bcryptjs';

import { testConn } from '../../../testUtils/testConn';
import { TestClient } from '../../../testUtils/TestClient';
import { User } from '../../../entity/User';

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
  faker.seed(1);
});

afterAll(async () => {
  await conn.close();
});

const email = faker.internet.email();
const password = faker.internet.password();

describe('Register', () => {
  describe('should create user', async () => {
    const res = await TestClient.register(email, password, 'John', 'Smith');
    const user = await User.findOne({ where: { email } });
    it('should be in database', async () => {
      expect(user).not.toBeUndefined();
    });
    it('should hash password', async () => {
      expect.assertions(1);
      expect(await bcrypt.compare(password, user!.password)).toBeTruthy();
    });
    it('should return user', () => {
      expect(res.data).not.toBeNull();
      expect(res.data!.register.email).toBe(email);
      expect(res.errors).toBeUndefined();
    });
  });
  describe('should not create user if email already exists', async () => {
    const res = await TestClient.register(email, password, 'John', 'Smith');
    it('should return null and errors object', () => {
      expect(res.data).toBeNull();
      expect(res.errors).not.toBeUndefined();
    });
    it('should not save user in db', async () => {
      const [, count] = await User.findAndCount({ where: { email } });
      expect(count).toBe(1);
    });
  });
  describe('should not create user if email or password are wrong', async () => {
    const email1 = faker.internet.email();
    const email2 = faker.internet.email();
    const password1 = faker.internet.password();
    const password2 = faker.internet.password();
    const res1 = await TestClient.register(email1, password1, 'John1', 'Smith1');
    const res2 = await TestClient.register(email2, password2, 'John2', 'Smith2');
    it('should return null and errors object', () => {
      expect(res1.data).toBeNull();
      expect(res1.errors).not.toBeUndefined();
      expect(res2.data).toBeNull();
      expect(res2.errors).not.toBeUndefined();
    });
    it('should not save user in db', async () => {
      const [, count1] = await User.findAndCount({ where: { email1 } });
      expect(count1).toBe(1);
      const [, count2] = await User.findAndCount({ where: { email2 } });
      expect(count2).toBe(1);
    });
  });
});
