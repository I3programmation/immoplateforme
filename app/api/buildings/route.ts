import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Gestion de la méthode GET pour récupérer les bâtiments, colonnes, tâches et tags associés
export async function GET(request: Request) {
  try {
    // Récupérer les bâtiments avec leurs colonnes, tâches et tags associés
    const buildings = await prisma.building.findMany({
      where: {
        buildingName: {
          not: "Default TaskList",
        },
      },
      include: {
        columns: {
          include: {
            tasks: {
              include: {
                tags: true, // Inclure les tags associés à chaque tâche
              },
            },
          },
        },
      },
    });

    return new Response(JSON.stringify(buildings), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Erreur lors de la récupération des données", {
      status: 500,
    });
  }
}
