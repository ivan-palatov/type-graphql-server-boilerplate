import 'dotenv';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema, formatArgumentValidationError } from 'type-graphql';
import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';
import cors from 'cors';

export const redis = new Redis();

export const main = async () => {
  await createConnection();
  const schema = await buildSchema({ resolvers: [__dirname + '/modules/**/*.?s'] });
  const apolloServer = new ApolloServer({
    schema,
    formatError: formatArgumentValidationError as any,
    context: ({ req }) => ({ req }),
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
