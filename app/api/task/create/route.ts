import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function ensureDefaultColumn() {
  // Vérifier si la colonne par défaut existe déjà
  let defaultColumn = await prisma.column.findUnique({
    where: { id: "task-list-column" },
  });
  if (!defaultColumn) {
    // Si elle n'existe pas, créer un bâtiment par défaut (ou utiliser un bâtiment existant)
    const defaultBuilding = await prisma.building.upsert({
      where: { buildingName: "Default TaskList" },
      update: {},
      create: {
        buildingName: "Default TaskList",
        buildingGroup: "Default",
        subgroup: "Default",
      },
    });

    // Créer la colonne par défaut pour la TaskList
    // Ici, on suppose que l'on veut utiliser une année fictive, par exemple 0, pour signifier la colonne par défaut
    defaultColumn = await prisma.column.create({
      data: {
        id: "task-list-column", // on force l'id
        title: "Task List",
        year: "", // ou toute valeur qui indique "par défaut"
        buildingId: defaultBuilding.id,
      },
    });
  }
  return defaultColumn;
}

export async function POST(req: Request) {
  console.log("Création tâche");
  try {
    const data = await req.json();
    console.log("Payload reçu:", data);

    const building = data.building || {
      id: "",
      buildingName: "",
      buildingGroup: "",
      subgroup: "",
    };
    const { column, task } = data;

    let columnId = "task-list-column";

    if (!building.buildingName || building.buildingName.trim() === "") {
      await ensureDefaultColumn();

      // 🔥 Find the highest index in "task-list-column"
      const maxIndex = await prisma.task.aggregate({
        where: { columnId },
        _max: { index: true },
      });

      const newIndex = (maxIndex._max.index ?? -1) + 1;

      const newTask = await prisma.task.create({
        data: {
          content: task.content,
          priority: task.priority,
          price: task.price,
          discipline: task.discipline,
          description: task.description,
          columnId,
          index: newIndex, // ✅ Assign the next available index
          tags: {
            connect: task.tags.map((tagId: string) => ({ id: tagId })),
          },
        },
      });

      return new Response(JSON.stringify(newTask), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    let buildingId = building.id;

    if (!buildingId) {
      const newBuilding = await prisma.building.create({
        data: {
          buildingName: building.buildingName,
          buildingGroup: building.buildingGroup,
          subgroup: building.subgroup,
        },
      });
      buildingId = newBuilding.id;

      const columnsData = [
        { title: "2025", year: "2025" },
        { title: "2026", year: "2026" },
        { title: "2027", year: "2027" },
        { title: "2028", year: "2028" },
        { title: "2029", year: "2029" },
      ];

      await prisma.column.createMany({
        data: columnsData.map((col) => ({
          ...col,
          buildingId: buildingId,
        })),
      });
    }

    const foundColumn = await prisma.column.findFirst({
      where: {
        year: column.year,
        buildingId: buildingId,
      },
    });

    if (!foundColumn) {
      return new Response(
        JSON.stringify({ error: "La colonne n'existe pas" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 🔥 Find the highest index in the target column
    const maxIndex = await prisma.task.aggregate({
      where: { columnId: foundColumn.id },
      _max: { index: true },
    });

    const newIndex = (maxIndex._max.index ?? -1) + 1;

    const newTask = await prisma.task.create({
      data: {
        content: task.content,
        priority: task.priority,
        price: task.price,
        discipline: task.discipline,
        description: task.description,
        columnId: foundColumn.id,
        index: newIndex, // ✅ Assign the next available index
        tags: {
          connect: task.tags.map((tagId: string) => ({ id: tagId })),
        },
      },
    });

    return new Response(JSON.stringify(newTask), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("❌ Erreur création tâche:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
