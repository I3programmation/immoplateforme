import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        column: true, // Inclut les infos sur la colonne (année)
        tags: true, // Inclut les tags associés à la tâche
      },
    });

    return new Response(JSON.stringify(tasks), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    return new Response("Erreur interne du serveur", { status: 500 });
  }
}
