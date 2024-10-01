import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "./mongodb";
import { redirect } from "next/navigation";
import getServerSession from "next-auth"; 

const authOptions: NextAuthConfig = {
  adapter: MongoDBAdapter(client),
  providers: [
   Google
  ],
  pages: {
    error: "/"
  }
}

export {authOptions}

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);


export async function loginIsRequiredServer() {
  try {
    // Fetch the session on the server
    const session = await getServerSession(authOptions);
    
    // Check if the user is not authenticated
    if (!session) {
      // Redirect to the root ("/") if not authenticated
      return redirect("/");
    }

    // User is authenticated, continue with your logic
    console.log("User Session:", session);
    
    return session; // Optionally return session if needed for further processing
  } catch (error) {
    console.error("Error fetching session:", error);
    // Optional: handle any errors (e.g., log them or return a specific error page)
    return redirect("/error");
  }
}