// seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Créer un bâtiment par défaut pour la TaskList
  const defaultBuilding = await prisma.building.upsert({
    where: { buildingName: "Default TaskList" },
    update: {},
    create: {
      buildingName: "Default TaskList",
      buildingGroup: "Default",
      subgroup: "Default",
    },
  });

  // Créer une colonne par défaut avec l'id "task-list-column"
  // Attention : Pour forcer l'id, vous pouvez utiliser la fonction raw ou modifier votre modèle pour autoriser un id personnalisé.
  // Voici une solution avec raw SQL (vérifiez que c'est compatible avec votre configuration) :
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Column" (id, title, year, "buildingId")
    VALUES ('task-list-column', 'Task List', 0, '${defaultBuilding.id}')
    ON CONFLICT (id) DO NOTHING;
  `);

  console.log("Seed terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
