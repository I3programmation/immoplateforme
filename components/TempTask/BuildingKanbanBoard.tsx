"use client";
import React, { useState, useEffect } from "react";
import PlusIcon from "../icons/PlusIcon";
import { ChartNoAxesColumn, Ellipsis, SearchIcon, Triangle, Plus } from 'lucide-react';
import { Building, Column, Multiplier, Task } from "@/types/types";
import BuildingContainer from "./BuildingContainer";
import BuildingModal from "../BuildingModal";
import { add } from "date-fns";
import { DragOverEvent } from "@dnd-kit/core";
import TaskColHeader from "./TaskColHeader";
import { Popover } from "@mui/material";
import TaskCostMultiplierModal from "./TaskCostMultiplierModal";

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
  const [multipliers, setMultipliers] = useState<Multiplier[]>([]);
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isCostCalculationOpen, setIsCostCalculationOpen] = useState(false);
  const [anchorElCostCalculation, setAnchorElCostCalculation] =
    useState<HTMLElement | null>(null);
  const [currentlySelectedMultipliers, setCurrentlySelectedMultipliers] =
    useState<Multiplier[]>([]);
  const [isCummulative, setIsCummulative] = useState(true);

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

  const fetchMultipliers = async () => {
    try {
      const response = await fetch("/api/multipliers");
      if (!response.ok)
        throw new Error("Erreur de chargement des multiplicateurs");
      const data = await response.json();
      setMultipliers(data);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des multiplicateurs:", error);
      return [];
    }
  };

  // ✅ Fetch multipliers on mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchMultipliers();
    };
    fetchData();
  }, []);

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

  const handleCostCalculationClick = (
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    setIsCostCalculationOpen(true);
    setAnchorElCostCalculation(event.currentTarget);
  };

  const handleCostCalculationClose = () => {
    setIsCostCalculationOpen(false);
    setAnchorElCostCalculation(null);
  };

  return (
    <div className="p-4 mt-5 pb-[10%] overflow-y-auto">
      <div className="flex w-full">
        {/* Left Section - IMMEUBLE */}
        <div className="w-1/6 flex items-center rounded-tl-2xl justify-center bg-backgroundColor border border-secondaryColor p-2 text-textColor">
          <div className="flex h-full items-end">
            <div className="flex gap-1 h-1/5 mb-3">
                <h2 className="text-[1.8rem] font-bold">Immeuble</h2>
              <div className="flex mt-[0.7rem] items-center gap-2 h-1/2">
                <button
                  className="ml-2 flex- items-center"
                >
                      <Triangle size={14} className="text-primaryColor rotate-180 fill-primaryColor" />
                </button>
                <button
                  onClick={() => setIsBuildingModalOpen(true)}
                  className=" flex- items-center"
                >
                      <Plus size={24} className="text-primaryColor" />
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Right Section (Contains Search Bar + ANNÉE DE RÉALISATION + Years) */}
        <div className="w-5/6">
          {/* 🔥 NEW: Top Bar with Search + Tags + Cost Calculation */}
          <div className="flex items-center h-[4.25rem] pl-[1rem] justify-between rounded-tr-2xl bg-backgroundColor border-t border-b border-r border-secondaryColor p-2">
              <div className="relative w-1/3">
                <input
                type="text"
                placeholder="Rechercher..."
                className="p-2 bg-backgroundColor text-textColor border border-secondaryColor rounded w-full"
                />
                <span
                className="absolute top-1/2 right-[4%] transform -translate-y-1/2 text-textColor"
                >
                <SearchIcon size={20} className="text-primaryColor" />
                </span>
              </div>

            {/* Tags & Cost Calculation */}
            <div className="flex items-center justify-end gap-[3rem] text-textColor text-lg w-1/2 mr-5">
                <button className="flex items-center gap-2 hover:opacity-70">
                  Exporter en Excel
                  <ChartNoAxesColumn size={25} className="text-primaryColor" />
                </button>
                <button className="flex items-center gap-2 hover:opacity-70">
                  #Tags
                  <Ellipsis size={25} className="text-primaryColor" />
                </button>
                <button className="flex items-center gap-2 hover:opacity-70" onClick={handleCostCalculationClick}>
                  Calcul des coûts
                  <Ellipsis size={25} className="text-primaryColor" />
                </button>
                <Popover
                  open={isCostCalculationOpen}
                  onClose={handleCostCalculationClose}
                  anchorEl={anchorElCostCalculation}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  slotProps={{
                    paper: {
                      style: {
                        backgroundColor: "transparent",
                      },
                    },
                  }}
                >
                  <TaskCostMultiplierModal
                      multipliers={multipliers}
                      currentlySelectedMultipliers={currentlySelectedMultipliers}
                      isCummulative={isCummulative}
                      setIsCummulative={setIsCummulative}
                      setCurrentlySelectedMultipliers={
                        setCurrentlySelectedMultipliers
                      }
                      setMultipliers={setMultipliers}
                      handleClose={handleCostCalculationClose}
                  />
              </Popover>
            </div>
          </div>

          {/* Existing - Année de Réalisation */}
          <div className="flex items-center justify-center bg-backgroundColor border-b border-r border-secondaryColor p-2 text-textColor">
            <h2 className="text-[1.3rem]">
              Année de réalisation
            </h2>
            <div className="flex items-center justify-center gap-2 ml-2">
              <Triangle size={12} className="text-primaryColor rotate-180 fill-primaryColor" />
              <Plus size={20} className="text-primaryColor" />
            </div>
          </div>

          {/* Existing - Years Row */}
          <div className="flex ">
            {titles.map((title, index) => (
              <TaskColHeader
                key={index}
                title={title}
                tasks={tasks}
                columns={columns.filter((col) => col.title === title)}
                currentlyAppliedMultipliers={currentlySelectedMultipliers}
                isCummulative={isCummulative}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full  overflow-y-auto ">
        {buildings.map((building) => (
          <BuildingContainer
            key={building.id}
            building={building}
            columns={columns.filter((col) => col.buildingId === building.id)}
            deleteBuilding={deleteBuilding}
            tasks={tasks}
            currentlyAppliedMultipliers={currentlySelectedMultipliers}
            setTasks={setTasks}
            deleteTask={deleteTask} // ✅ Pass deleteTask
            onDoubleClick={onDoubleClick}
            isCummulative={isCummulative}
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
