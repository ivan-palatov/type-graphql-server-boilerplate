import { buildSchema } from 'type-graphql';

export const createSchema = () =>
  buildSchema({
    resolvers: [__dirname + '/../modules/**/*.resolver.?s'],
    authChecker: ({ context: { req } }) => {
      return !(!req.session || !req.session.userId);
    },
    dateScalarMode: 'isoDate',
  });
