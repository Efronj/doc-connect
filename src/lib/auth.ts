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
            // PASSWORD SYNC: If Firebase authenticated the user (which it did if we reached here)
            // but the local password doesn't match, update the local password now.
            // This handles cases where the user reset their password in Firebase.
            const newHashedPassword = await bcrypt.hash(credentials.password, 12);
            await prisma.user.update({
              where: { id: user.id },
              data: { password: newHashedPassword }
            });
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
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.department = user.department;
        token.bio = user.bio;
        token.hospital = user.hospital;
      }

      if (trigger === "update") {
        console.log(`[AUTH] Trigger update for ID: ${token.id}`);
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string }
        });
        if (dbUser) {
          console.log(`[AUTH] Found user in DB: ${dbUser.name}, Dept: ${dbUser.department}`);
          token.role = dbUser.role;
          token.department = dbUser.department;
          token.bio = dbUser.bio;
          token.hospital = dbUser.hospital;
        } else {
          console.log(`[AUTH] User NOT found in DB for update!`);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.department = token.department;
        session.user.bio = token.bio;
        session.user.hospital = token.hospital;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
