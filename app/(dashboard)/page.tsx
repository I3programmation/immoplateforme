"use client";
import { useState } from "react";
import { Task, UpdateTaskData, TaskFormData } from "@/types/types";
import Modal from "@/components/Modal";

export default function Home() {
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskFormData | null>(null);

  const updateTask = async (taskId: string, updatedData: UpdateTaskData) => {
    try {
      const response = await fetch(`/api/task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Définir le type de contenu en JSON
        },
        body: JSON.stringify(updatedData), // Sérialiser les données à envoyer
      });

      if (response.ok) {
        const updatedTask = await response.json(); // Récupérer la réponse JSON
        console.log("✅ Tâche mise à jour :", updatedTask);
        alert("Tâche mise à jour avec succès !");
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de la mise à jour de la tâche", errorData);
        alert(
          `Erreur lors de la mise à jour de la tâche: ${errorData.message}`
        );
      }
    } catch (error) {
      console.error("Erreur de connexion", error);
      alert("Une erreur de connexion s'est produite.");
    }
  };

  const handleUpdate = () => {
    updateTask("8345d568-61b9-48dc-8411-cf8326e9c89a", {
      priority: "Haute", // Changer la priorité de la tâche
      tags: {
        connect: ["da73da6c-a2ed-4270-9d22-d49aed031537"], // ajouter le tag avec l'ID "tag1" de la tâche
      },
    });
  };

  const getTotalPriceForYear = async (year: number) => {
    try {
      const response = await fetch(`/api/task/totalPrice?year=${year}`);
      if (response.ok) {
        const price = await response.json();
        console.log(`Total price for year ${year}:`, price);
        setTotalPrice(price);
      } else {
        const errorData = await response.json();
        console.error("Error fetching total price", errorData);
      }
    } catch (error) {
      console.error("Error fetching total price:", error);
    }
  };

  const handleSaveTask = async (task: TaskFormData) => {
    try {
      const response = await fetch("/api/task/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        const savedTask = await response.json();
        console.log("✅ Tâche enregistrée :", savedTask);
        alert("Tâche enregistrée avec succès !");
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de l'enregistrement de la tâche", errorData);
        alert(
          `Erreur lors de l'enregistrement de la tâche: ${errorData.message}`
        );
      }
    } catch (error) {
      console.error("Erreur de connexion", error);
      alert("Une erreur de connexion s'est produite.");
    }
  };
  const handleRemoveTask = (id: string) => {
    console.log("Removing task with ID:", id);
    // Remove the task
  };

  return (
    <div className="flex w-full flex-col gap-4 h-full items-center justify-center">
      <button onClick={handleUpdate} className="p-2 border-2 border-white">
        test Put
      </button>

      <button
        onClick={() => getTotalPriceForYear(2026)}
        className="p-2 border-2 border-white"
      >
        test total amount
      </button>
      <h1>{totalPrice ? totalPrice.toString() : "Loading..."}</h1>

      <button onClick={() => setisModalOpen(true)}>Open Modal</button>
      {isModalOpen && (
        <Modal
          onSave={handleSaveTask}
          onClose={() => setisModalOpen(false)}
          onRemove={handleRemoveTask}
          isOpen={isModalOpen}
          task={selectedTask}
        />
      )}
    </div>
  );
}
