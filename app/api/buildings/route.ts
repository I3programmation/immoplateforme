import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const buildings = await prisma.building.findMany({
      orderBy: { buildingName: "asc" }, // Trie alphabétiquement
    });

    return new Response(JSON.stringify(buildings), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des bâtiments :", error);
    return new Response("Erreur serveur", { status: 500 });
  }
}
