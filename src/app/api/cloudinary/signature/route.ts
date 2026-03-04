import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import crypto from "crypto";

export async function POST() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const folder = process.env.CLOUDINARY_FOLDER || "demurban/products";

  const timestamp = Math.floor(Date.now() / 1000);

  // Parameters you will send to Cloudinary
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;

  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + apiSecret)
    .digest("hex");

  return NextResponse.json({
    cloudName,
    apiKey,
    timestamp,
    folder,
    signature,
  });
}