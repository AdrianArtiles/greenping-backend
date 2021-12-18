/* eslint-disable import/prefer-default-export */
import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../generated/hasura';

const grHasura = new GraphQLClient(`${process.env.HASURA_GRAPHQL_URL}`, {
  headers: { 'x-hasura-admin-secret': `${process.env.HASURA_GRAPHQL_ADMIN_SECRET}` },
});

const hasuraClient = getSdk(grHasura);

export { hasuraClient };
