"use client";
import React, { useMemo } from "react";
import { Building, Column, Task } from "@/types/types";
import ColumnContainer from "./ColumnContainer";
import { SortableContext } from "@dnd-kit/sortable";
import TrashIcons from "../icons/TrashIcons";
import { DragOverEvent } from "@dnd-kit/core";

interface BuildingContainerProps {
  building: Building;
  deleteBuilding: (id: string) => void;
  columns: Column[]; // Pass columns separately since Building doesn't have them
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  deleteTask: (id: string) => void;
  // ✅ Add onDragOver with correct type
  onDoubleClick: (taskId: string) => void;
}

function BuildingContainer({
  building,
  deleteBuilding,
  columns,
  tasks,
  setTasks,
  deleteTask,
  onDoubleClick,
}: BuildingContainerProps) {
  // Filter only columns related to this building
  const buildingColumns = useMemo(
    () => columns.filter((col) => col.buildingId === building.id),
    [columns, building.id]
  );
  const columnsId = useMemo(
    () => buildingColumns.map((col) => col.id),
    [buildingColumns]
  );

  return (
    <div className="flex flex-wrap items-center overflow-x-auto ">
      <div className="m-auto flex">
        {/* Building Info */}
        <div className="bg-backgroundColor border-b border-r border-l border-secondaryColor flex w-[250px]  justify-center">
          <div className="flex flex-col w-[100%] pt-5 pl-5">
            <h2 className="text-[1.25rem] w-full text-textColor font-bold">{building.buildingName}</h2>
            <h3 className="text-xs text-textColor font-thin">Groupe : {building.buildingGroup}</h3>
            <h3 className="text-xs text-textColor font-thin">Sous-groupe : {building.subgroup}</h3>
          </div>
          <button
            className="flex justify-end items-end pr-5 pb-5"
            onClick={() => deleteBuilding(building.id)}
          >
            <TrashIcons className="text-textColor h-5 w-5" />
          </button>
        </div>

        {/* Columns Container */}
        <div className="flex">
          <SortableContext items={columnsId}>
            {buildingColumns.map((col) => (
              <ColumnContainer
                key={col.id}
                column={col}
                tasks={tasks.filter((task) => task.columnId === col.id)}
                setTasks={setTasks}
                deleteTask={deleteTask} // ✅ Pass deleteTask
                onDoubleClick={onDoubleClick} // ✅ Pass onDoubleClick
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}

export default BuildingContainer;
