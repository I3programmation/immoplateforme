import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Rechercher tous les multiplicateurs
    const multipliers = await prisma.multiplier.findMany({
      orderBy: { order: "asc" },
    });

    // Retourner les multiplicateurs
    return new Response(JSON.stringify(multipliers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Erreur récupération multiplicateurs:", error);
    return new Response("Erreur serveur", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, value } = data;

    // Vérifier si le multiplicateur existe déjà
    const existingMultiplier = await prisma.multiplier.findUnique({
      where: { name },
    });

    const order = (await prisma.multiplier.count()) + 1; // Compter le nombre de multiplicateurs existants pour définir l'ordre

    if (existingMultiplier) {
      return new Response("Ce multiplicateur existe déjà", { status: 400 });
    }

    // Créer un nouveau multiplicateur
    const newMultiplier = await prisma.multiplier.create({
      data: {
        name,
        value,
        order,
      },
    });

    return new Response(JSON.stringify(newMultiplier), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Erreur création multiplicateur:", error);
    return new Response("Erreur serveur", { status: 500 });
  }
}
