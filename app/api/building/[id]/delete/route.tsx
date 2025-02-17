// app/api/building/[id]/delete/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    // Supprimer le bâtiment avec toutes ses colonnes et tâches (grâce à la cascade)
    await prisma.building.delete({
      where: {
        id: id, // L'ID du bâtiment à supprimer
      },
    });

    return new Response(
      JSON.stringify({ message: `Bâtiment ${id} supprimé avec succès` }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Erreur lors de la suppression du bâtiment",
        details: error,
      }),
      {
        status: 500,
      }
    );
  }
}
