import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Validation function for credentials
function validateCredentials(username: string, password: string): boolean {
  const validUsername = process.env.AUTH_USERNAME || "ali-ahangar";
  const validPassword = process.env.AUTH_PASSWORD || "test1";

  // In production, you would hash passwords and compare with database
  return username === validUsername && password === validPassword;
}

// Enhanced user lookup function with detailed error handling
async function authenticateUser(username: string, password: string) {
  try {
    // Input validation
    if (!username || !password) {
      return { error: "MISSING_CREDENTIALS", user: null };
    }

    // Trim whitespace
    username = username.trim();

    // Basic validation
    if (username.length < 3) {
      return { error: "INVALID_USERNAME_LENGTH", user: null };
    }

    if (password.length < 4) {
      return { error: "INVALID_PASSWORD_LENGTH", user: null };
    }

    const validUsername = process.env.AUTH_USERNAME || "ali-ahangar";
    const validPassword = process.env.AUTH_PASSWORD || "test1";

    // Check username first
    if (username !== validUsername) {
      return { error: "INVALID_USERNAME", user: null };
    }

    // If username is correct, check password
    if (password !== validPassword) {
      return { error: "INVALID_PASSWORD", user: null };
    }

    // Both correct
    return {
      error: null,
      user: {
        id: "1",
        name: username,
        email: `${username}@persian-service-tracker.com`,
        role: "admin",
      },
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return { error: "SYSTEM_ERROR", user: null };
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: {
          label: "نام کاربری",
          type: "text",
          placeholder: "نام کاربری خود را وارد کنید",
        },
        password: {
          label: "رمز عبور",
          type: "password",
          placeholder: "رمز عبور خود را وارد کنید",
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("MISSING_CREDENTIALS");
        }

        const result = await authenticateUser(
          credentials.username,
          credentials.password
        );

        if (result.user) {
          return {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
          };
        }

        // Throw specific error based on authentication result
        throw new Error(result.error || "AUTHENTICATION_FAILED");
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: parseInt(process.env.SESSION_MAX_AGE || "86400"), // 24 hours default
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: parseInt(process.env.SESSION_MAX_AGE || "86400"),
  },

  pages: {
    signIn: "/auth/signIn",
    signOut: "/auth/logout",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub || "";
        session.user.role = token.role;
      }
      return session;
    },
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(
        `User signed in: ${user.name} at ${new Date().toISOString()}`
      );
    },

    async signOut({ token }) {
      console.log(
        `User signed out: ${
          token?.name || "Unknown"
        } at ${new Date().toISOString()}`
      );
    },
  },

  debug: process.env.NODE_ENV === "development",

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
