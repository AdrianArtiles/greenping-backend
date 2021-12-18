import { gql } from 'graphql-tag';
import { Resolvers } from './generated/resolvers-types';
import { hasuraClient } from './libraries/internalClients';

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    account_id: String!
  }

  type Account {
    id: ID!
    name: String!
  }

  type Query {
    whoami: User
    account(id: ID!): Account
  }

  type Mutation {
    insertUserOne(email: String!): User
    insertAccountOne(name: String!): Account
  }
`;

const resolvers: Resolvers = {
  Query: {
    whoami: async (_parent, _args, context) => context.user,
    account: async (_parent, args) => {
      const a1 = await hasuraClient.AccountById({ id: args.id })
      const account = a1.account_by_pk;
      // this is a bit verbose, but just to illustrate returning an empty response
      if (!account) return null;
      return {
        id: account.id,
        name: account.name,
      };
    }
  },
  Mutation: {
    insertUserOne: async (_parent, args) => {
      // right now since a user belongs to an account
      // whenever we create a user, we will first create a new account
      // and use that account id for the user we are creating
      // in a real scenario, we'd obviously in the UX create the account first
      // and require that account id in the args for this mutation.
      // maybe we'll do that later
      const { email } = args;
      console.log('> attempting to make user with', { email });

      const accountName = `${email}'s account`

      const createAccountQuery = await hasuraClient.InsertAccount({ name: accountName });
      if (!createAccountQuery.insert_account_one) throw new Error('unable to create account');

      const accountId = createAccountQuery.insert_account_one.id;
      const createUserQuery = await hasuraClient.InsertUserEmailAccount({ email, accountId });
      if (!createUserQuery.insert_user_one) throw new Error('unable to create user');

      const user = createUserQuery.insert_user_one;
      return user;

      // const fakeUser = {
      //   id: '7890-poiu',
      //   email,
      // }
      // return fakeUser;
    },
    insertAccountOne: async (_parent, args, context) => {
      if (!context.user) throw new Error('User required');
      const { name } = args;
      console.log('> attempting to make account with', { name });

      const createAccountQuery = await hasuraClient.InsertAccount({ name });
      if (!createAccountQuery.insert_account_one) throw new Error('unable to create account');
      const account = createAccountQuery.insert_account_one;
      return {
        id: account.id,
        name: account.name,
      };

      // const fakeAccount = {
      //   id: '1234-asdf',
      //   name,
      // }
      // return fakeAccount;
    },
  },
};

export { resolvers, typeDefs };
