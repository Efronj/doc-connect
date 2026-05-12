import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return new NextResponse("Missing image data", { status: 400 });
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "doctornet_posts",
      resource_type: "auto",
    });

    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
