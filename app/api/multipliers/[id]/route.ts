// app/api/multipliers/[id]/route.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const { name, value, order } = await req.json();

  try {
    // Mettre à jour le multiplicateur par son ID
    const updatedMultiplier = await prisma.multiplier.update({
      where: { id },
      data: { name, value, order },
    });

    // Adapter les ordres des autres multiplicateurs
    await prisma.$transaction(async (prisma) => {
      const allMultipliers = await prisma.multiplier.findMany({
        where: { id: { not: id } },
        orderBy: { order: "asc" },
      });

      let currentOrder = 1;
      for (const multiplier of allMultipliers) {
        if (currentOrder === order) currentOrder++; // Skip the updated order
        await prisma.multiplier.update({
          where: { id: multiplier.id },
          data: { order: currentOrder },
        });
        currentOrder++;
      }
    });

    return new Response(JSON.stringify(updatedMultiplier), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Erreur mise à jour multiplicateur:", error);
    return new Response("Erreur serveur", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    // Supprimer le multiplicateur par son ID
    await prisma.multiplier.delete({
      where: { id },
    });

    return new Response("Multiplicateur supprimé avec succès", { status: 200 });
  } catch (error) {
    console.error("❌ Erreur suppression multiplicateur:", error);
    return new Response("Erreur serveur", { status: 500 });
  }
}
