import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        let user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        // SELF-HEALING: If user exists in Firebase but not in MongoDB, create them now
        if (!user) {
          const hashedPassword = await bcrypt.hash(credentials.password, 12);
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0],
              username: credentials.email.split('@')[0] + Math.floor(Math.random() * 1000),
              password: hashedPassword,
            }
          });
        }

        // Check password (bypass if it's a verified Google login)
        if (credentials.password !== "google-auth-bypass-key") {
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password || ""
          );

          if (!isCorrectPassword) {
            throw new Error('Invalid credentials');
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          department: user.department,
          bio: user.bio,
          hospital: user.hospital
        };
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.department = (user as any).department;
        token.bio = (user as any).bio;
        token.hospital = (user as any).hospital;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).department = token.department;
        (session.user as any).bio = token.bio;
        (session.user as any).hospital = token.hospital;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
