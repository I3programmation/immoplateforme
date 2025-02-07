import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createBuildingsAndTasks() {
  try {
    // Create 2 buildings with tasks
    const buildings = await Promise.all(
      Array.from({ length: 2 }).map(async (_, index) => {
        const buildingName = `Building ${index + 2}`; // Building 2, Building 3, ...
        const building = await prisma.building.create({
          data: {
            buildingName,
            buildingGroup: "Group 1",
            subgroup: "Zone X",
            columns: {
              create: [
                // Tasks in 2025
                {
                  title: "2025",
                  year: 2025,
                  tasks: {
                    create: [
                      {
                        content: "Task 1 in 2025",
                        priority: "High",
                        price: 5000,
                        discipline: "Renovation",
                        description: "Task for renovation in 2025",
                      },
                      {
                        content: "Task 2 in 2025",
                        priority: "High",
                        price: 5000,
                        discipline: "Renovation",
                        description: "Task for renovation in 2025",
                      },
                    ],
                  },
                },
                // Task in 2026
                {
                  title: "2026",
                  year: 2026,
                  tasks: {
                    create: [
                      {
                        content: "Task in 2026",
                        priority: "High",
                        price: 7000,
                        discipline: "Renovation",
                        description: "Task for renovation in 2026",
                      },
                    ],
                  },
                },
              ],
            },
          },
        });
        return building;
      })
    );

    console.log("✅ Buildings and tasks created:", buildings);
  } catch (error) {
    console.error("Error creating buildings and tasks:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createBuildingsAndTasks();
