import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const bucket = process.env.SUPABASE_BUCKET || "photos";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    if (!path) {
      return new NextResponse("Missing path parameter", { status: 400 });
    }

    // Generate a signed URL for the private bucket
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600); // 1 hour expiry

    if (error) {
      console.error("Error creating signed URL:", error);
      return new NextResponse("Error generating signed URL", { status: 500 });
    }

    if (!data?.signedUrl) {
      return new NextResponse("No signed URL generated", { status: 500 });
    }

    // Fetch the image from the signed URL
    const imageResponse = await fetch(data.signedUrl);

    if (!imageResponse.ok) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType =
      imageResponse.headers.get("content-type") || "image/jpeg";

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
