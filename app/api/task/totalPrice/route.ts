// pages/api/task/totalPrice.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Récupérer l'année des paramètres de la requête
    const year = new URL(request.url).searchParams.get("year");
    // Retrieve the year from the query params
    if (!year) {
      return new Response("Year is required", { status: 400 });
    }

    // Calculate the total price for tasks in the given year
    const result = await prisma.task.aggregate({
      _sum: {
        price: true, // Sum the prices
      },
      where: {
        column: {
          year: parseInt(year, 10), // Filter tasks by the specified year
        },
      },
    });

    // Return the total price for that year
    return new Response(JSON.stringify(result._sum.price), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching total price:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
