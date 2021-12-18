import express, { Request } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { Context } from './types/main';
import { resolvers, typeDefs } from './resolver';


[
  'HASURA_GRAPHQL_ADMIN_SECRET',
  'HASURA_GRAPHQL_URL',
  'PORT',
  // 'REDIS_URL',
  // 'SECRET_KEY',
  // 'SENTRY_DSN',
].map((k) => { if (!process.env[k]) throw new Error(`Missing required ENV: ${k}`); }); // eslint-disable-line array-callback-return

const schema = makeExecutableSchema({ typeDefs, resolvers });

const buildContext = async (request: Request): Promise<Context> => {
  // const user = await getIdentity({ req: request })
  //   // eslint-disable-next-line no-console
  //   .catch((error) => { console.log('> identity error', error); return undefined; });
  // // eslint-disable-next-line max-len
  // // if (user && user.account_id) account = (await hasuraClient.AccountById({ id: user.account_id })).account_by_pk as any;
  //
  // return { user };
  return {};
};

const buildGraphqlConfig = async (request: Request) => {
  const context = await buildContext(request);

  return {
    schema,
    graphiql: true,
    context,
  };
};
const app = express();

(async () => {
  app.enable('trust proxy');
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3030',
      'https://www.getgreenping.com',
    ],
    credentials: true,
  }));

  // app.use('/blueauth', blueauthHandler);
  app.use('/graphql', async (req, res) => {
    const config = await buildGraphqlConfig(req);
    graphqlHTTP(config)(req, res);
  });
})();

// eslint-disable-next-line import/prefer-default-export
export { app };
