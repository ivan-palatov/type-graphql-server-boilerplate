import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import { buildSchema } from 'type-graphql';

const main = async () => {
  await createConnection();
  const schema = await buildSchema({ resolvers: [__dirname + '/modules/**/*.?s'] });
  const apolloServer = new ApolloServer({ schema });

  const app = express();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`Server is ready on http://localhost:4000/graphql`);
  });
};

main();
