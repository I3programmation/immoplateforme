"use client";
import React, { useMemo } from "react";
import { Building, Column, Multiplier, Task } from "@/types/types";
import ColumnContainer from "./ColumnContainer";
import { SortableContext } from "@dnd-kit/sortable";
import TrashIcons from "../icons/TrashIcons";
import { DragOverEvent } from "@dnd-kit/core";

interface BuildingContainerProps {
  building: Building;
  deleteBuilding: (id: string) => void;
  columns: Column[]; // Pass columns separately since Building doesn't have them
  tasks: Task[];
  currentlyAppliedMultipliers: Multiplier[];
  isCummulative: boolean;
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
  currentlyAppliedMultipliers,
  isCummulative,
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
  const totalBuildingCost = useMemo(() => {
    const totalGrossCost = buildingColumns.reduce((currentTotal, column) => {
      const columnTasks = tasks.filter((task) => task.columnId === column.id);
      const columnCost = columnTasks.reduce((currentColumnTotal, task) => {
        const taskCost = Number(task.price) || 0;
        return currentColumnTotal + taskCost;
      }, 0);
      return currentTotal + columnCost;
    }, 0);

    let rawFinalCost = 0;
    if (isCummulative) {
      rawFinalCost = currentlyAppliedMultipliers.reduce(
        (currentTotal, multiplier) => {
          return currentTotal * multiplier.value;
        },
        totalGrossCost
      );
    } else {
      const totalAdjustementPercentage = currentlyAppliedMultipliers.reduce(
        (currentTotal, multiplier) => {
          return currentTotal + (multiplier.value - 1);
        },
        0
      );
      rawFinalCost = totalGrossCost * (1 + totalAdjustementPercentage);
    }

    return Math.round((rawFinalCost + Number.EPSILON) * 100) / 100;
  }, [buildingColumns, isCummulative, currentlyAppliedMultipliers, tasks]);

  return (
    <div className="flex flex-wrap items-center overflow-x-auto ">
      <div className="m-auto flex">
        {/* Building Info */}

        <div className="bg-backgroundColor  text-textColor border-b border-r border-l border-secondaryColor flex w-[250px]  justify-center">
          <div className="flex flex-col w-[100%] pt-5 pl-5">
            <h2 className="text-[1.25rem] w-full font-bold">
              {building.buildingName}
            </h2>
            <h3 className="text-xs font-thin">
              Groupe : {building.buildingGroup}
            </h3>
            <h3 className="text-xs font-thin">
              Sous-groupe : {building.subgroup}
            </h3>
            <div className="ml-auto">
              <strong>{totalBuildingCost}$</strong>
              <sup>
                (
                {currentlyAppliedMultipliers
                  .map((multiplier) => multiplier.order)
                  .join(", ") || 0}
                )
              </sup>
            </div>
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
                currentlyAppliedMultipliers={currentlyAppliedMultipliers}
                isCummulative={isCummulative}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}

export default BuildingContainer;
