import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: haal alle secties op (publiek – wordt door de website gebruikt)
export async function GET() {
  const rows = await prisma.websiteContent.findMany({
    orderBy: { sectie: "asc" },
  });

  const content: Record<string, unknown> = {};
  for (const row of rows) {
    content[row.sectie] = JSON.parse(row.inhoud);
  }

  return NextResponse.json(content, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}

// PUT: sla een sectie op (alleen ingelogde gebruikers)
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { sectie, inhoud } = (await request.json()) as {
    sectie: string;
    inhoud: Record<string, unknown>;
  };

  if (!sectie || !inhoud) {
    return NextResponse.json({ error: "sectie en inhoud zijn verplicht" }, { status: 400 });
  }

  await prisma.websiteContent.update({
    where: { sectie },
    data: { inhoud: JSON.stringify(inhoud) },
  });

  return NextResponse.json({ ok: true });
}
