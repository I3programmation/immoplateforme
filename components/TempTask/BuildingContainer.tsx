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
  const totalBuildingCost = useMemo(
    () =>
      buildingColumns.reduce((currentTotal, column) => {
        const columnTasks = tasks.filter((task) => task.columnId === column.id);
        const columnCost = columnTasks.reduce((currentColumnTotal, task) => {
          const taskCost = Number(task.price) || 0;
          return currentColumnTotal + taskCost;
        }, 0);
        return currentTotal + columnCost;
      }, 0),
    [buildingColumns, tasks]
  );

  return (
    <div className="flex flex-wrap items-center overflow-x-auto overflow-y-hidden ">
      <div className="m-auto flex">
        {/* Building Info */}
        <div className="bg-mainBackgroundColor border-b border-r border-l border-white p-4 flex flex-col w-[250px]  ">
          <div className="flex flex-col w-full">
            <h2 className="text-3xl font-semibold">{building.buildingName}</h2>
            <h3 className="text-xl font-thin">{building.buildingGroup}</h3>
            <h3 className="text-xl font-thin">{building.subgroup}</h3>
          </div>
          <span className=" ml-auto">{totalBuildingCost}$</span>
          <button
            className="mt-auto"
            onClick={() => deleteBuilding(building.id)}
          >
            <TrashIcons />
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
