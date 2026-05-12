import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const posts = await prisma.post.findMany({
      where: {
        author: {
          username: username
        }
      },
      include: {
        author: {
          select: {
            name: true,
            username: true,
            image: true,
            role: true,
            department: true
          }
        },
        likes: true,
        _count: {
          select: { comments: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("USER_POSTS_GET_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
