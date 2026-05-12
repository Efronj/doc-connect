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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { savedPostIds: true }
    });

    const isSaved = user?.savedPostIds.includes(postId);

    if (isSaved) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          savedPostIds: {
            set: user?.savedPostIds.filter(id => id !== postId)
          }
        }
      });
      return NextResponse.json({ saved: false });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          savedPostIds: {
            push: postId
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
