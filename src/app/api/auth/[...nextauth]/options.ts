import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import Credentials from "next-auth/providers/credentials";
import { SignInSchema } from "@/schemas/signInSchema";
import { NextAuthConfig } from 'next-auth';

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: "Email/Username", placeholder: "Email/Username" },
        password: { label: "Password", placeholder: "Password" }
      },
      authorize: async (credentials: any): Promise<any> => {
        await dbConnect();

        try {
          const { email, password } = await SignInSchema.parseAsync(credentials);
          const user = await UserModel.findOne({
            $or: [
              { email: email },
              { username: email }
            ]
          });

          if (!user) {
            throw new Error("Email or Username is incorrect");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account to login");
          }

          const isPasswordCorrect = await bcrypt.compare(password, user.password);

          if (!isPasswordCorrect) {
            throw new Error("Password is incorrect");
          }

          return user;

        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          _id: token._id as string | undefined,
          isVerified: token.isVerified as boolean | undefined,
          isAcceptingMessages: token.isAcceptingMessages as boolean | undefined,
          username: token.username as string | undefined
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/signIn'
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET
};
