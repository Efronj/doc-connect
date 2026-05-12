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

    const userId = (session.user as any).id;

    const existingLike = await prisma.like.findFirst({
      where: {
        userId: userId,
        postId: postId
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.like.create({
        data: {
          userId: userId,
          postId: postId
        }
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("LIKE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
