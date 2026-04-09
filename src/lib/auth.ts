import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Brugernavn", type: "text" },
        password: { label: "Adgangskode", type: "password" }
      },
      async authorize(credentials) {
        console.log("---> [AUTH] Loginforsøg modtaget for bruger:", credentials?.username);

        if (!credentials?.username || !credentials?.password) {
          console.log("---> [AUTH] Fejl: Manglende brugernavn eller password");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username }
          });

          if (!user) {
            console.log("---> [AUTH] Fejl: Brugeren findes ikke i databasen");
            return null;
          }

          const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
          if (!passwordsMatch) {
            console.log("---> [AUTH] Fejl: Forkert password angivet");
            return null;
          }

          console.log("---> [AUTH] Succes! Password matcher for:", user.username);
          return {
            id: user.id,
            name: user.username,
            role: user.role,
          };
        } catch (error) {
          console.error("---> [AUTH] Kritisk Database Fejl under login:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-sauna-key-2026",
  debug: true, // <--- TÆNDER FOR AL INTERN NEXTAUTH LOGGING!
};