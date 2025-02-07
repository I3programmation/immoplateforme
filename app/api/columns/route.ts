// app/api/columns/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const buildingId = url.searchParams.get("buildingId");

    if (!buildingId) {
      return new Response("buildingId is required", { status: 400 });
    }

    // Rechercher toutes les colonnes associées à ce buildingId
    const columns = await prisma.column.findMany({
      where: { buildingId },
      orderBy: { year: "asc" }, // Trier par année
    });

    // Retourner les colonnes
    return new Response(JSON.stringify(columns), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Erreur récupération colonnes:", error);
    return new Response("Erreur serveur", { status: 500 });
  }
}
