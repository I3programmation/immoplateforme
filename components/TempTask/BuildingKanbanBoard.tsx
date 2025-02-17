"use client";
import React, { useState, useEffect } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Building, Task } from "./types";
import BuildingContainer from "./BuildingContainer";
import BuildingModal from "../BuildingModal";
import { add } from "date-fns";

interface BuildingKanbanBoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const BuildingKanbanBoard: React.FC<BuildingKanbanBoardProps> = ({
  tasks,
  setTasks,
}) => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const titles = ["Nom du bâtiment", "2025", "2026", "2027", "2028", "2029"];

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch("/api/buildings"); // Remplace par la bonne route
        if (!response.ok) throw new Error("Erreur de chargement");

        const data = await response.json();
        setBuildings(data);
      } catch (error) {
        console.error("Erreur lors du chargement des bâtiments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  const addBuilding = async (buildingData: {
    buildingName: string;
    buildingGroup: string;
    subgroup: string;
  }) => {
    try {
      const response = await fetch("/api/building/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildingData),
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout du bâtiment");

      const newBuilding = await response.json();

      // Ajouter le nouveau bâtiment à la liste affichée
      setBuildings((prev) => [...prev, newBuilding]);
    } catch (error) {
      console.error("Erreur lors de l'ajout du bâtiment:", error);
    }
  };

  const deleteBuilding = async (id: string) => {
    try {
      const response = await fetch(`/api/building/${id}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la suppression du bâtiment"
        );
      }
      setBuildings((prevBuildings) =>
        prevBuildings.filter((building) => building.id !== id)
      );
    } catch (error) {
      console.error("❌ Erreur lors de la suppression du bâtiment:", error);
    }
  };

  const handleSaveTask = (task: Task) => {
    // Mettre à jour la tâche dans la colonne appropriée
    setBuildings((prevBuildings) =>
      prevBuildings.map((building) => ({
        ...building,
        columns: building.columns.map((column) =>
          column.id === task.columnId
            ? {
                ...column,
                tasks: column.tasks.map((t) => (t.id === task.id ? task : t)),
              }
            : column
        ),
      }))
    );
  };

  return (
    <div className=" p-4">
      <div className="flex w-[1500px] items-center justify-center order-2 border-white ">
        {titles.map((title, index) => (
          <div
            key={index}
            className="w-1/6 flex items-center justify-center bg-mainBackgroundColor border-2 border-white p-4"
          >
            {title}
            {index === 0 && (
              <button
                className="mr-2 ml-4"
                onClick={() => setIsBuildingModalOpen(true)}
              >
                <PlusIcon />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-h-[80vh] overflow-y-auto">
        {buildings.map((building) => (
          <BuildingContainer
            key={building.id}
            building={building}
            deleteBuilding={deleteBuilding}
            tasks={tasks}
            setTasks={setTasks}
          />
        ))}
      </div>
      <BuildingModal
        isOpen={isBuildingModalOpen}
        onClose={() => setIsBuildingModalOpen(false)}
        onSave={(buildingData: {
          buildingName: string;
          buildingGroup: string;
          subgroup: string;
        }) => {
          addBuilding(buildingData);
          setIsBuildingModalOpen(false);
        }}
      />
      {/* <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onRemove={handleRemoveTask}
        task={selectedTask}
      /> */}
    </div>
  );
};

export default BuildingKanbanBoard;
