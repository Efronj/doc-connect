import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    // Find user by username (ignoring case and whitespace)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: username, mode: 'insensitive' } },
          { name: { contains: username, mode: 'insensitive' } }
        ]
      },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("USER_FETCH_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
