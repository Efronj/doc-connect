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

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { savedPostIds: true }
    });

    const isSaved = user?.savedPostIds.includes(params.postId);

    if (isSaved) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          savedPostIds: {
            set: user?.savedPostIds.filter(id => id !== params.postId)
          }
        }
      });
      return NextResponse.json({ saved: false });
    } else {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          savedPostIds: {
            push: params.postId
          }
        }
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error("SAVE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
