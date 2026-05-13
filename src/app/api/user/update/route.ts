import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("USER_GET_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, bio, department, role, isPrivate } = body;

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email
      },
      data: {
        name,
        bio,
        department,
        role,
        isPrivate
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("USER_UPDATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
