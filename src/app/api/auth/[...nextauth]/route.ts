import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Since this is a template without a heavy admin user table,
        // we'll use an environment variable comparison.
        const adminUser = process.env.ADMIN_USER || "admin";
        const adminPass = process.env.ADMIN_PASS || "luxury2026";
        
        if (credentials?.username === adminUser && credentials?.password === adminPass) {
          return { id: "1", name: "Admin", email: "admin@zyroz.agency" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_super_secret_for_development"
});

export { handler as GET, handler as POST };
