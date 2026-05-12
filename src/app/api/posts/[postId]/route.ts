import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { postId } = await params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (post.authorId !== (session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { postId } = await params;
  const { content } = await request.json();

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (post.authorId !== (session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { content },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}
