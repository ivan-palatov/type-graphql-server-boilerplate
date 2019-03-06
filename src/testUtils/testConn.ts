import { createConnection } from 'typeorm';

export const testConn = async (drop: boolean = false) => {
  return createConnection({
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123',
    database: 'type-graphql-server-boilerplate-test',
    synchronize: drop,
    dropSchema: drop,
    logging: false,
    entities: [__dirname + '/../entity/**/*.*'],
    migrations: [__dirname + '/../migration/**/*.ts'],
    subscribers: [__dirname + '/../subscriber/**/*.ts'],
  });
};
