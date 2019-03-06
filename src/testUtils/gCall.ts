import { graphql, GraphQLSchema } from 'graphql';
import { createSchema } from '../utils/createSchema';
import Maybe from 'graphql/tsutils/Maybe';

interface IOptions {
  source: string;
  variableValues?: Maybe<{ [key: string]: any }>;
}

let schema: GraphQLSchema;

export const gCall = async ({ source, variableValues }: IOptions) => {
  if (!schema) {
    schema = await createSchema();
  }
  return graphql({
    schema,
    source,
    variableValues,
  });
};
