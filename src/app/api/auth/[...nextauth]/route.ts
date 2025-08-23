import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is where you'd typically look up the user from a database.
        // For now, we'll just check against the hardcoded credentials.
        if (
          credentials?.username === "@li-ahangar11" &&
          credentials?.password === "12Test#pro"
        ) {
          // Any object returned will be saved in `user` property of the JWT
          return { id: "1", name: "@li-ahangar11", email: "" };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signIn",
  },
});

export { handler as GET, handler as POST };
