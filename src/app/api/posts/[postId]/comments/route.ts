import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content } = await req.json();

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: postId,
        userId: (session.user as any).id
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            role: true,
            department: true
          }
        }
      }
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("COMMENT_POST_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            role: true,
            department: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("COMMENTS_GET_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
