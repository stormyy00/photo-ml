import { authenticate } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("=== ZIP Download with Streaming ===");

    const { uid } = await authenticate();
    console.log("Authenticated UID:", uid);

    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    console.log("Request params:", { type, id });

    if (!type || !id || !["folder", "person"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 },
      );
    }

    const query =
      type === "folder"
        ? `type=folder&folder_id=${id}&user_id=${uid}`
        : `type=person&person_id=${id}&user_id=${uid}`;

    const backendUrl = `${process.env.BACKEND_URL}/api/zip?${query}`;
    console.log("Backend URL:", backendUrl);

    if (!process.env.BACKEND_URL) {
      return NextResponse.json(
        { error: "BACKEND_URL not configured" },
        { status: 500 },
      );
    }

    try {
      console.log("Streaming from Flask...");

      const response = await fetch(backendUrl, {
        method: "GET",
        headers: {
          Accept: "application/zip",
          "User-Agent": "NextJS-API-Stream",
        },
      });

      console.log("Flask response status:", response.status);
      console.log(
        "Flask response headers:",
        Object.fromEntries(response.headers.entries()),
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Flask error response:", errorText);

        try {
          const errorJson = JSON.parse(errorText);
          return NextResponse.json(
            { error: errorJson.error || `Flask error: ${response.status}` },
            { status: response.status },
          );
        } catch {
          return NextResponse.json(
            { error: `Flask error: ${response.status} - ${errorText}` },
            { status: response.status },
          );
        }
      }

      const contentDisposition = response.headers.get("content-disposition");
      const contentLength = response.headers.get("content-length");
      const contentType = response.headers.get("content-type");

      console.log("Streaming ZIP file, size:", contentLength);

      const responseHeaders = new Headers({
        "Content-Type": contentType || "application/zip",
        "Cache-Control": "no-cache",
      });

      if (contentDisposition) {
        responseHeaders.set("Content-Disposition", contentDisposition);
      } else {
        responseHeaders.set(
          "Content-Disposition",
          `attachment; filename="${type}_${id}.zip"`,
        );
      }

      if (contentLength) {
        responseHeaders.set("Content-Length", contentLength);
      }

      return new NextResponse(response.body, {
        status: 200,
        headers: responseHeaders,
      });
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);

      if (fetchError instanceof Error) {
        if (fetchError.name === "AbortError") {
          return NextResponse.json(
            { error: "Request timeout" },
            { status: 408 },
          );
        }
        if (fetchError.message.includes("ECONNREFUSED")) {
          return NextResponse.json(
            { error: "Cannot connect to backend server" },
            { status: 503 },
          );
        }
      }

      return NextResponse.json(
        { error: `Backend connection failed: ${String(fetchError)}` },
        { status: 503 },
      );
    }
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
