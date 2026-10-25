import { buildApkgFromJson } from "@/lib/build-apkg";
import { formatZodError } from "@/lib/deck-schema";
import { ZodError } from "zod";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  try {
    const { bytes, filename } = await buildApkgFromJson(body);
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid deck JSON", details: formatZodError(e) },
        { status: 400 },
      );
    }
    const message = e instanceof Error ? e.message : "Failed to build deck";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
