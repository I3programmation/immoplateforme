import { PrismaClient } from "@prisma/client";
// import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    // Vérifier si l'utilisateur est authentifié
    // const { userId } = getAuth(request);  // Vérifier l'authentification via Clerk

    // if (!userId) {
    //   return new Response("Non autorisé", { status: 401 });  // Si l'utilisateur n'est pas authentifié, retour 401
    // }

    // Récupérer les données du body de la requête
    const {
      content,
      priority,
      price,
      discipline,
      description,
      columnId,
      tags,
    } = await request.json();

    // Construire les opérations pour les tags
    const tagOperations = {
      connect: tags?.connect?.map((tagId: string) => ({ id: tagId })), // Ajouter des tags existants
      disconnect: tags?.disconnect?.map((tagId: string) => ({ id: tagId })), // Retirer des tags existants
      set: tags?.set?.map((tagId: string) => ({ id: tagId })), // Remplacer tous les tags associés
    };

    // Mise à jour de la tâche avec les nouveaux attributs et tags
    const updatedTask = await prisma.task.update({
      where: { id }, // Utilise l'id de la tâche passé dans l'URL
      data: {
        content,
        priority,
        price,
        discipline,
        description,
        columnId, // Nouvelle colonne (année) si la tâche doit être déplacée
        tags: tagOperations, // Appliquer les changements sur les tags
      },
    });

    // Retourner la tâche mise à jour avec un statut 200 (OK)
    return new Response(JSON.stringify(updatedTask), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Erreur lors de la mise à jour de la tâche", {
      status: 500,
    });
  }
}
