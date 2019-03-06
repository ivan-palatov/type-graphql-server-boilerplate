import { Connection } from 'typeorm';
import faker from 'faker';
import bcrypt from 'bcryptjs';

import { testConn } from '../../../testUtils/testConn';
import { TestClient } from '../../../testUtils/TestClient';
import { User } from '../../../entity/User';

faker.seed(1);
const email = faker.internet.email();
const password = faker.internet.password();
const email1 = faker.internet.email();
const password2 = faker.internet.password();

let conn: Connection;
let user: User | undefined;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

describe('Register', () => {
  describe('should create user', () => {
    it('should return user', async () => {
      expect.assertions(3);
      const res = await TestClient.register(email, password, 'John', 'Smith');
      expect(res.data).not.toBeNull();
      expect(res.data!.register.email).toBe(email);
      expect(res.errors).toBeUndefined();
    });
    it('should be in database', async () => {
      expect.assertions(1);
      user = await User.findOne({ where: { email } });
      expect(user).not.toBeUndefined();
    });
    it('should hash password', async () => {
      expect.assertions(1);
      expect(await bcrypt.compare(password, user!.password)).toBeTruthy();
    });
  });
  describe('should not create user if email already exists', () => {
    it('should return null and errors object', async () => {
      expect.assertions(2);
      const res = await TestClient.register(email, password, 'John', 'Smith');
      expect(res.data).toBeNull();
      expect(res.errors).not.toBeUndefined();
    });
    it('should not save user in db', async () => {
      expect.assertions(1);
      const [, count] = await User.findAndCount({ where: { email } });
      expect(count).toBe(1);
    });
  });
  describe('should not create user if email or password are wrong', () => {
    it('should return null and errors object', async () => {
      expect.assertions(4);
      const res1 = await TestClient.register(email1, '21k', 'John1', 'Smith1');
      const res2 = await TestClient.register('kek.com', password2, 'John2', 'Smith2');
      expect(res1.data).toBeNull();
      expect(res1.errors).not.toBeUndefined();
      expect(res2.data).toBeNull();
      expect(res2.errors).not.toBeUndefined();
    });
    it('should not save user in db', async () => {
      expect.assertions(2);
      const [, count1] = await User.findAndCount({ where: { email: email1 } });
      const [, count2] = await User.findAndCount({ where: { email: 'kek.com' } });
      expect(count1).toBe(0);
      expect(count2).toBe(0);
    });
  });
});
