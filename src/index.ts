import 'dotenv';
import 'reflect-metadata';

import cors from 'cors';
import Redis from 'ioredis';
import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { formatArgumentValidationError } from 'type-graphql';
import { createSchema } from './utils/createSchema';

export const redis = new Redis();

export const main = async () => {
  await createConnection();
  const schema = await createSchema();
  const apolloServer = new ApolloServer({
    schema,
    formatError: formatArgumentValidationError as any,
    context: ({ req, res }) => ({ req, res, redis }),
    debug: false,
  });

  const app = express();

  const RedisStore = connectRedis(session);

  app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: 'rid',
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 3600 * 24 * 365,
      },
    })
  );

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`Server is ready on http://localhost:4000/graphql`);
  });
};

main();
