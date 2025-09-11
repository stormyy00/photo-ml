export const handleDownload = async (
  id: string,
  type: "folder" | "person",
  onProgress?: (loaded: number, total?: number) => void,
) => {
  try {
    console.log("Starting streaming download:", { id, type });

    const url = `/api/zip?type=${type}&id=${id}`;
    console.log("Fetching URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/zip, application/json",
      },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage = `HTTP ${response.status}`;

      if (contentType?.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } else {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }

      console.error("Response error:", errorMessage);
      throw new Error(errorMessage);
    }

    const contentDisposition = response.headers.get("content-disposition");
    const filename =
      contentDisposition?.match(/filename="([^"]+)"/)?.[1] ||
      `${type}_${id}.zip`;

    console.log("Download filename:", filename);

    const contentLengthHeader = response.headers.get("content-length");
    const totalSize = contentLengthHeader
      ? parseInt(contentLengthHeader, 10)
      : undefined;

    console.log(
      "Total size:",
      totalSize ? `${Math.round(totalSize / 1024 / 1024)}MB` : "unknown",
    );

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Unable to read response stream");
    }

    const chunks: Uint8Array<ArrayBuffer>[] = [];
    let receivedLength = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      receivedLength += value.length;

      if (onProgress) {
        onProgress(receivedLength, totalSize);
      }

      if (totalSize && receivedLength % (5 * 1024 * 1024) === 0) {
        const percent = Math.round((receivedLength / totalSize) * 100);
        console.log(
          `Download progress: ${percent}% (${Math.round(receivedLength / 1024 / 1024)}MB)`,
        );
      }
    }

    console.log(
      "Stream completed, total received:",
      Math.round(receivedLength / 1024 / 1024),
      "MB",
    );

    const blob = new Blob(chunks, { type: "application/zip" });
    console.log("Final blob size:", Math.round(blob.size / 1024 / 1024), "MB");

    const url_obj = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url_obj;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url_obj);

    console.log("Download completed successfully");
    return { success: true, filename, size: blob.size };
  } catch (error) {
    console.error("Download error details:", error);
    throw error;
  }
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
