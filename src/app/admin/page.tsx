import { prisma } from "@/lib/prisma";
import { WebsiteEditor } from "@/components/WebsiteEditor";

export default async function AdminPage() {
  const rows = await prisma.websiteContent.findMany({
    orderBy: { sectie: "asc" },
  });

  const secties: Record<string, unknown> = {};
  for (const row of rows) {
    secties[row.sectie] = JSON.parse(row.inhoud);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Website teksten</h1>
        <p className="text-gray-500 mt-1">
          Pas de teksten op de Trobuso website aan. Wijzigingen zijn direct zichtbaar.
        </p>
      </div>
      <WebsiteEditor initialData={secties} />
    </div>
  );
}
