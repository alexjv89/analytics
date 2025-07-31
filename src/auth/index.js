import "server-only"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import SequelizeAdapter, { models } from "@auth/sequelize-adapter"
import { getSequelizeInstance } from '@/database/sequelize.js'

function createAuthConfig() {
  const sequelize = getSequelizeInstance();
  
  return {
    providers: [Google],
    adapter: SequelizeAdapter(sequelize, {
      models: {
        User: sequelize.define('users', {
          ...models.User,
        }, {
          schema: 'auth',
          tableName: 'users',
          timestamps: false,
        }),
        Account: sequelize.define('accounts', {
          ...models.Account,
        }, {
          schema: 'auth',
          tableName: 'accounts',
          timestamps: false,
        }),
        Session: sequelize.define('sessions', {
          ...models.Session,
        }, {
          schema: 'auth',
          tableName: 'sessions',
          timestamps: false,
        }),
        VerificationToken: sequelize.define('verification_tokens', {
          ...models.VerificationToken,
        }, {
          schema: 'auth',
          tableName: 'verification_tokens',
          timestamps: false,
        }),
      }
    }),
    callbacks: {
      session({ session, user }) {
        // When using database sessions, we need to add the user id manually
        session.user.id = user.id
        return session
      }
    }
  };
}

export const { handlers, signIn, signOut, auth } = NextAuth(createAuthConfig());