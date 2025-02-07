import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Création d'un bâtiment avec plusieurs colonnes (années)
  const building = await prisma.building.create({
    data: {
      buildingName: "Immeuble A", // Nom du bâtiment
      buildingGroup: "Groupe 1", // Groupe d'immeuble
      subgroup: "Zone X", // Sous-groupe
      columns: {
        create: [
          { title: "2025", year: 2025 },
          { title: "2026", year: 2026 },
          { title: "2027", year: 2027 },
        ],
      },
    },
    include: {
      columns: true, // Inclure les colonnes dans la réponse
    },
  });

  console.log("✅ Bâtiment créé avec les colonnes : ", building);

  // Créer quelques tags (exemple)
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: "Urgent" },
      update: {},
      create: { name: "Urgent" },
    }),
    prisma.tag.upsert({
      where: { name: "Plomberie" },
      update: {},
      create: { name: "Plomberie" },
    }),
    prisma.tag.upsert({
      where: { name: "Peinture" },
      update: {},
      create: { name: "Peinture" },
    }),
  ]);

  console.log("✅ Tags créés ou récupérés : ", tags);

  // Ajouter des tâches pour chaque colonne avec des tags associés
  const tasks = await Promise.all(
    building.columns.map((column) =>
      prisma.task.create({
        data: {
          content: `Tâche pour ${column.title}`, // Contenu de la tâche
          priority: "Haute", // Priorité de la tâche
          price: 5000, // Prix de la tâche
          discipline: "Rénovation", // Discipline de la tâche
          description: `Description pour la tâche de ${column.title}`, // Description
          columnId: column.id, // Référence à la colonne
          tags: {
            connect: tags.map((tag) => ({ id: tag.id })), // Associer les tags à la tâche
          },
        },
      })
    )
  );

  console.log(
    "✅ Tâches ajoutées pour chaque colonne avec des tags associés : ",
    tasks
  );

  // Récupérer ce bâtiment avec toutes ses colonnes et tâches
  const buildingWithTasks = await prisma.building.findUnique({
    where: { id: building.id },
    include: {
      columns: {
        include: { tasks: { include: { tags: true } } }, // Inclure les tâches et leurs tags
      },
    },
  });

  console.log(
    "📊 Bâtiment avec ses colonnes, tâches et tags : ",
    buildingWithTasks
  );

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
