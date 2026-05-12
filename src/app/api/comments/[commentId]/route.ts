import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { commentId } = await params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    
    // Allow deletion if the user is the author of the comment OR the author of the post
    // But for now, let's stick to comment author.
    if (comment.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
