import NextAuth from "next-auth";
import Google from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "./mongodb";



export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [
   Google
  ],
  pages: {
    error: "/"
  }
});

