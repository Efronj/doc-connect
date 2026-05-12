import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password, username, category, specialty } = body;

    if (!email || !name || !password || !username) {
      return new NextResponse("Missing information", { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return new NextResponse("User already exists with this email or username", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        username,
        password: hashedPassword,
        category,
        specialty,
        role: "DOCTOR"
      }
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("REGISTRATION_ERROR", error);
    if (error.code === 'P2002') {
      return new NextResponse("User already exists", { status: 400 });
    }
    return new NextResponse(`Database Connection Error: ${error.message || "Internal Error"}`, { status: 500 });
  }
}
