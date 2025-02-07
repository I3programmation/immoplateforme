// app/api/task/create/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { building, column, task } = data;

    let buildingId = building.id;

    // 🔹 Si le building.id n'est pas fourni, on crée un nouveau bâtiment
    if (!buildingId) {
      // Créer un nouveau bâtiment
      const newBuilding = await prisma.building.create({
        data: {
          buildingName: building.buildingName,
          buildingGroup: building.buildingGroup,
          subgroup: building.subgroup,
        },
      });

      buildingId = newBuilding.id;

      // 🔹 Créer les 5 colonnes (2025-2029) pour ce bâtiment
      const columnsData = [
        { title: "2025", year: 2025 },
        { title: "2026", year: 2026 },
        { title: "2027", year: 2027 },
        { title: "2028", year: 2028 },
        { title: "2029", year: 2029 },
      ];

      // Créer toutes les colonnes en une seule requête
      await prisma.column.createMany({
        data: columnsData.map((col) => ({
          ...col,
          buildingId: buildingId,
        })),
      });
    }

    // 🔹 Récupérer la colonne correspondant à l'année choisie pour ce bâtiment
    const columnId = await prisma.column.findFirst({
      where: {
        year: column.year,
        buildingId: buildingId,
      },
    });

    if (!columnId) {
      return new Response("La colonne n'existe pas", { status: 404 });
    }

    // 🔹 Créer la tâche et la lier à la colonne
    const newTask = await prisma.task.create({
      data: {
        content: task.content,
        priority: task.priority,
        price: parseFloat(task.price), // Convertir string en nombre
        discipline: task.discipline,
        description: task.description,
        columnId: columnId.id, // Lier à la colonne récupérée
        tags: {
          connect: task.tags.map((tagId: string) => ({ id: tagId })),
        },
      },
    });

    return new Response(JSON.stringify(newTask), { status: 201 });
  } catch (error) {
    console.error("❌ Erreur création tâche:", error);
    return new Response("Erreur serveur", { status: 500 });
  }
}
