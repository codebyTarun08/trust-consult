import User from '@/models/userModel';
import { cloudinaryConnect } from '@/lib/cloudinaryConfig';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinaryConnect();

export async function POST(request) {
  try {
    const id = request.headers.get("x-user-id");
   //
    console.log("ID", id);

    const data = await request.formData();
    const image = data.get("image"); // This is a File object
   // console.log(data)
   // console.log(image)
    if (!image || !id) {
      return NextResponse.json({ message: "Image or User ID not provided" }, { status: 400 });
    }

    // Convert File -> Buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload as base64 string
    const result = await cloudinary.uploader.upload(
      `data:${image.type};base64,${buffer.toString("base64")}`,
      {
        folder: process.env.FOLDER_NAME,
        resource_type: "auto",
      }
    );

    // Save URL in DB
    await User.findByIdAndUpdate(id, { image: result.secure_url }, { new: true });

    return NextResponse.json({ success: true, message: "Image uploaded successfully", url: result.secure_url });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, message: "Image upload failed" }, { status: 500 });
  }
}
