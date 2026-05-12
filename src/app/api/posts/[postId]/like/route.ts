import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        userId: session.user.id,
        postId: params.postId
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
          userId: session.user.id,
          postId: params.postId
        }
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("LIKE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
