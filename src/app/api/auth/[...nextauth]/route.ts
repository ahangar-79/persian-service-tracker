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

// User lookup function (for future database integration)
async function authenticateUser(username: string, password: string) {
  try {
    // Input validation
    if (!username || !password) {
      return null;
    }

    // Trim whitespace
    username = username.trim();
    
    // Basic validation
    if (username.length < 3 || password.length < 4) {
      return null;
    }

    // For now, use environment variables
    // In production, replace this with database lookup and bcrypt comparison
    if (validateCredentials(username, password)) {
      return {
        id: "1",
        name: username,
        email: `${username}@persian-service-tracker.com`,
        role: "admin"
      };
    }

    return null;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
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
          placeholder: "نام کاربری خود را وارد کنید"
        },
        password: { 
          label: "رمز عبور", 
          type: "password",
          placeholder: "رمز عبور خود را وارد کنید"
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await authenticateUser(
          credentials.username,
          credentials.password
        );

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          };
        }

        return null;
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
        session.user.id = token.sub || '';
        session.user.role = token.role;
      }
      return session;
    },
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User signed in: ${user.name} at ${new Date().toISOString()}`);
    },
    
    async signOut({ token }) {
      console.log(`User signed out: ${token?.name || 'Unknown'} at ${new Date().toISOString()}`);
    },
  },

  debug: process.env.NODE_ENV === "development",
  
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
