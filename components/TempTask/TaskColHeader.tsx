"use client";
import { Column, Multiplier, Task } from "@/types/types";
import { useMemo } from "react";

interface TaskColHeaderProps {
  title: string;
  tasks: Task[];
  columns: Column[];
  currentlyAppliedMultipliers: Multiplier[];
  isCummulative: boolean;
}
const TaskColHeader: React.FC<TaskColHeaderProps> = ({
  title,
  tasks,
  columns,
  currentlyAppliedMultipliers,
  isCummulative,
}) => {
  const columnCost = useMemo(() => {
    const columTasks = tasks.filter((task) =>
      columns.some((col) => col.id === task.columnId)
    );
    const columnGrossCost = columTasks.reduce((currentColumnTotal, task) => {
      const taskCost = Number(task.price) || 0;
      return currentColumnTotal + taskCost;
    }, 0);

    let rawFinalCost = 0;
    if (isCummulative) {
      rawFinalCost = currentlyAppliedMultipliers.reduce(
        (currentTotal, multiplier) => {
          return currentTotal * multiplier.value;
        },
        columnGrossCost
      );
    } else {
      const totalAdjustementPercentage = currentlyAppliedMultipliers.reduce(
        (currentTotal, multiplier) => {
          return currentTotal + (multiplier.value - 1);
        },
        0
      );
      rawFinalCost =
        columnGrossCost + columnGrossCost * totalAdjustementPercentage;
    }

    return Math.round((rawFinalCost + Number.EPSILON) * 100) / 100;
  }, [columns, isCummulative, currentlyAppliedMultipliers, tasks]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-mainBackgroundColor border-b border-r border-white p-4">
      <span>{title}</span>
      <div>
        <span>{columnCost} $ </span>
        <sup>
          (
          {currentlyAppliedMultipliers
            .map((multiplier) => multiplier.order)
            .join(", ") || 0}
          )
        </sup>
      </div>
    </div>
  );
};

export default TaskColHeader;
