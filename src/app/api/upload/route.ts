// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ folder: "educatify" }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                })
                .end(buffer);
        });

        return NextResponse.json(result);
    } catch (err) {
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
