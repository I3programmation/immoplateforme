import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetAndSeed() {
  try {
    // 1️⃣ Vider les tables (en ordre pour éviter les conflits de clés étrangères)
    console.log("Vider toutes les tables...");

    await prisma.task.deleteMany({});
    await prisma.column.deleteMany({});
    await prisma.building.deleteMany({});
    await prisma.tag.deleteMany({});

    console.log("Tables vidées.");

    // 2️⃣ Créer 3 bâtiments avec leurs colonnes pour les années 2025 à 2029
    const buildingsData = [
      {
        buildingName: "Immeuble A",
        buildingGroup: "Groupe 1",
        subgroup: "Zone X",
      },
      {
        buildingName: "Immeuble B",
        buildingGroup: "Groupe 2",
        subgroup: "Zone Y",
      },
      {
        buildingName: "Immeuble C",
        buildingGroup: "Groupe 3",
        subgroup: "Zone Z",
      },
    ];

    const createdBuildings = await Promise.all(
      buildingsData.map((building) =>
        prisma.building.create({
          data: {
            buildingName: building.buildingName,
            buildingGroup: building.buildingGroup,
            subgroup: building.subgroup,
            columns: {
              create: [
                { title: "2025", year: 2025 },
                { title: "2026", year: 2026 },
                { title: "2027", year: 2027 },
                { title: "2028", year: 2028 },
                { title: "2029", year: 2029 },
              ],
            },
          },
          include: { columns: true },
        })
      )
    );

    console.log("3 bâtiments créés avec leurs colonnes.");

    // 3️⃣ Créer 2 tags
    const tagsData = ["Tag1", "Tag2"];
    const createdTags = await Promise.all(
      tagsData.map((tagName) =>
        prisma.tag.create({
          data: { name: tagName },
        })
      )
    );

    console.log("2 tags créés.");

    // 4️⃣ Créer des tâches pour chaque bâtiment et les associer à des tags
    const tasksData = [
      {
        content: "Réparation toiture",
        priority: "Haute",
        price: 5000,
        discipline: "Plomberie",
        description: "Réparer la toiture",
        tags: [createdTags[0].id, createdTags[1].id],
      },
      {
        content: "Réparation plomberie",
        priority: "Moyenne",
        price: 3000,
        discipline: "Plomberie",
        description: "Réparer la plomberie",
        tags: [createdTags[0].id],
      },
      {
        content: "Peinture intérieure",
        priority: "Basse",
        price: 2000,
        discipline: "Peinture",
        description: "Peindre les murs intérieurs",
        tags: [createdTags[1].id],
      },
    ];

    // Pour chaque bâtiment, ajouter des tâches dans les colonnes
    for (const building of createdBuildings) {
      const columnData = building.columns;

      for (let i = 0; i < tasksData.length; i++) {
        await prisma.task.create({
          data: {
            content: tasksData[i].content,
            priority: tasksData[i].priority,
            price: tasksData[i].price,
            discipline: tasksData[i].discipline,
            description: tasksData[i].description,
            columnId: columnData[i % columnData.length].id, // Répartir les tâches entre les 5 colonnes
            tags: {
              connect: tasksData[i].tags.map((tagId) => ({ id: tagId })),
            },
          },
        });
      }
    }

    console.log("Tâches créées et associées aux colonnes et tags.");
  } catch (error) {
    console.error("Erreur dans le script:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
resetAndSeed();
