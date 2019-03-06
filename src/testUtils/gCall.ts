import { graphql, GraphQLSchema } from 'graphql';
import { createSchema } from '../utils/createSchema';
import Maybe from 'graphql/tsutils/Maybe';
import RedisClient, { Redis } from 'ioredis';

interface IOptions {
  source: string;
  variableValues?: Maybe<{ [key: string]: any }>;
  userId?: number;
}

let schema: GraphQLSchema;
let redis: Redis;

export const gCall = async ({ source, variableValues, userId }: IOptions) => {
  if (!schema) {
    schema = await createSchema();
  }
  if (!redis) {
    redis = new RedisClient();
  }
  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {
        session: {
          userId,
        },
      },
      res: {
        clearCookie: jest.fn(),
      },
      redis,
    },
  });
};
