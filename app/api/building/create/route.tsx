// app/api/building/create/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { buildingName, buildingGroup, subgroup } = data;

    // 🔹 Création du bâtiment
    const newBuilding = await prisma.building.create({
      data: {
        buildingName,
        buildingGroup,
        subgroup,
      },
    });

    // 🔹 Création des colonnes associées (2025-2029)
    const columnsData = [
      { title: "2025", year: 2025 },
      { title: "2026", year: 2026 },
      { title: "2027", year: 2027 },
      { title: "2028", year: 2028 },
      { title: "2029", year: 2029 },
    ];

    const createdColumns = await prisma.$transaction(
      columnsData.map((col) =>
        prisma.column.create({
          data: {
            title: col.title,
            year: col.year,
            buildingId: newBuilding.id,
          },
        })
      )
    );

    // 🔹 Retourner l'immeuble avec ses colonnes
    return new Response(
      JSON.stringify({ ...newBuilding, columns: createdColumns }),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Erreur création bâtiment:", error);
    return new Response("Erreur serveur", { status: 500 });
  }
}
