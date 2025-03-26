"use client";
import React, { useState, useEffect } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Building, Column, Task } from "@/types/types";
import BuildingContainer from "./BuildingContainer";
import BuildingModal from "../BuildingModal";
import { add } from "date-fns";
import { DragOverEvent } from "@dnd-kit/core";

interface BuildingKanbanBoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  deleteTask: (id: string) => void;
  // ✅ Add onDragOver with correct type
  onDoubleClick: (taskId: string) => void;
}

const BuildingKanbanBoard: React.FC<BuildingKanbanBoardProps> = ({
  tasks,
  setTasks,
  deleteTask,
  onDoubleClick,
}) => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);

  const titles = ["2025", "2026", "2027", "2028", "2029"];

  const fetchBuildingsAndColumns = async () => {
    try {
      const response = await fetch("/api/buildings");
      if (!response.ok) throw new Error("Erreur de chargement des bâtiments");
      const data = await response.json();

      setBuildings(data);
      setColumns(data.flatMap((b: any) => b.columns || [])); // ✅ Extract columns correctly
    } catch (error) {
      console.error("❌ Erreur lors du chargement:", error);
    }
  };

  // ✅ Call the function on mount
  useEffect(() => {
    fetchBuildingsAndColumns();
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

      await response.json(); // ✅ No need to manually update state here

      // ✅ Re-fetch buildings & columns after adding a new one
      fetchBuildingsAndColumns();
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

  return (
    <div className="p-4">
      <div className="flex w-full">
        {/* Left Section - IMMEUBLE */}
        <div className="w-1/6 flex items-center rounded-tl-2xl justify-center bg-mainBackgroundColor border border-white p-2 text-white">
          <div className="flex">
            IMMEUBLE
            <button
              onClick={() => setIsBuildingModalOpen(true)}
              className="ml-2"
            >
              <PlusIcon />
            </button>
          </div>
        </div>

        {/* Right Section (Contains Search Bar + ANNÉE DE RÉALISATION + Years) */}
        <div className="w-5/6">
          {/* 🔥 NEW: Top Bar with Search + Tags + Cost Calculation */}
          <div className="flex items-center justify-between rounded-tr-2xl bg-mainBackgroundColor border-t border-b border-r border-white p-2">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Rechercher..."
              className="p-2 bg-black text-white border border-white rounded w-1/3"
            />

            {/* Tags & Cost Calculation */}
            <div className="flex items-center gap-4 text-white ">
              <span>#tags •••</span>
              <span>Calcul des coûts •••</span>
            </div>
          </div>

          {/* Existing - Année de Réalisation */}
          <div className="flex items-center justify-center bg-mainBackgroundColor border-b border-r border-white p-2">
            ANNÉE DE RÉALISATION
          </div>

          {/* Existing - Years Row */}
          <div className="flex ">
            {titles.map((title, index) => (
              <div
                key={index}
                className="flex-1 flex items-center justify-center bg-mainBackgroundColor border-b border-r border-white p-4"
              >
                {title}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-h-[80vh] overflow-y-auto ">
        {buildings.map((building) => (
          <BuildingContainer
            key={building.id}
            building={building}
            columns={columns.filter((col) => col.buildingId === building.id)}
            deleteBuilding={deleteBuilding}
            tasks={tasks}
            setTasks={setTasks}
            deleteTask={deleteTask} // ✅ Pass deleteTask
            onDoubleClick={onDoubleClick}
            // ✅ Pass onDoubleClick
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
    </div>
  );
};

export default BuildingKanbanBoard;
