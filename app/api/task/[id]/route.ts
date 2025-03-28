import { PrismaClient } from "@prisma/client";
// import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    // On récupère la tâche avec ses relations :
    // - La colonne associée (include: { building: true })
    // - Les tags associés
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        column: {
          include: {
            building: true,
          },
        },
        tags: true,
      },
    });

    if (!task) {
      return new Response(JSON.stringify({ error: "Tâche non trouvée" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Si votre type Task attend un tableau de string pour les tags,
    // on peut transformer le tableau de Tag en tableau d'ID.
    const taskData = {
      ...task,
      tags: task.tags.map((tag) => tag.id),
    };

    // Construction de l'objet TaskFormData
    const taskFormData = {
      task: taskData,
      column: task.column,
      building: task.column.building,
    };

    return new Response(JSON.stringify(taskFormData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Erreur lors de la récupération de la tâche", {
      status: 500,
    });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const requestBody = await request.json();

  console.log("📥 Received Request Body:", requestBody);

  try {
    // If the request body contains `task`, extract from it; otherwise, use requestBody directly
    const {
      content,
      priority,
      price,
      discipline,
      description,
      columnId,
      tags,
    } = requestBody.task || requestBody; // ✅ Handle both `{ task: {...} }` and `{ columnId: ... }`

    console.log("✅ Extracted Task Data:", {
      content,
      priority,
      price,
      discipline,
      description,
      columnId,
      tags,
    });

    // 🔹 Ensure at least one field to update is provided
    if (
      !content &&
      !priority &&
      !price &&
      !discipline &&
      !description &&
      !columnId &&
      !tags
    ) {
      return new Response("❌ Erreur: Aucune donnée à mettre à jour", {
        status: 400,
      });
    }

    // 🔹 Update only provided fields in the database
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(content !== undefined && { content }),
        ...(priority !== undefined && { priority }),
        ...(price !== undefined && { price }),
        ...(discipline !== undefined && { discipline }),
        ...(description !== undefined && { description }),
        ...(columnId !== undefined && { columnId }), // ✅ Handle column change
        tags: tags
          ? {
              connect: tags?.connect?.map((tagId: string) => ({ id: tagId })),
              disconnect: tags?.disconnect?.map((tagId: string) => ({
                id: tagId,
              })),
              set: tags?.set?.map((tagId: string) => ({ id: tagId })),
            }
          : undefined,
      },
    });

    console.log("✅ Updated Task:", updatedTask);
    return new Response(JSON.stringify(updatedTask), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error updating task:", error);
    return new Response("Erreur lors de la mise à jour de la tâche", {
      status: 500,
    });
  }
}
