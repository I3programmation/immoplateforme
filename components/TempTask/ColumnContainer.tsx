"use client";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column, Multiplier, Task } from "@/types/types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { SortableTask } from "@/components/SortableTask";

interface ColumnContainerProps {
  column: Column;
  tasks: Task[];
  currentlyAppliedMultipliers: Multiplier[];
  isCummulative: boolean;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  deleteTask: (id: string) => void;

  onDoubleClick: (taskId: string) => void;
}

function ColumnContainer({
  column,
  tasks,
  currentlyAppliedMultipliers,
  isCummulative,
  deleteTask,
  onDoubleClick,
}: ColumnContainerProps) {
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const totalCost = useMemo(() => {
    const grossCost = tasks.reduce((currentTotal, task) => {
      const taskCost = Number(task.price) || 0;
      return currentTotal + taskCost;
    }, 0);

    let rawFinalCost = 0;
    if (isCummulative) {
      rawFinalCost = currentlyAppliedMultipliers.reduce(
        (currentTotal, multiplier) => {
          return currentTotal * multiplier.value;
        },
        grossCost
      );
    } else {
      const totalAdjustementPercentage = currentlyAppliedMultipliers.reduce(
        (currentTotal, multiplier) => {
          return currentTotal + (multiplier.value - 1);
        },
        0
      );
      rawFinalCost = grossCost + grossCost * totalAdjustementPercentage;
    }

    return Math.round((rawFinalCost + Number.EPSILON) * 100) / 100;
  }, [isCummulative, currentlyAppliedMultipliers, tasks]);

  const {
    setNodeRef,

    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "Column", column },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 1 : 0,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-backgroundColor w-[250px] h-[300px] max-h-[500px]  flex flex-col opacity-40 border-2 border-rose-500"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-backgroundColor w-[250px] h-[300px] max-h-[500px]  flex flex-col"
    >
      {/* Column Task Container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto border-b border-r border-secondaryColor">
        <SortableContext
          items={tasksIds}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              deleteTask={() => deleteTask(task.id)}
              onDoubleClick={() => onDoubleClick(task.id)}
            />
          ))}
        </SortableContext>
        <div className="self-end mt-auto">
          <span>{totalCost} $ </span>
          <sup>
            (
            {currentlyAppliedMultipliers
              .map((multiplier) => multiplier.order)
              .join(", ") || 0}
            )
          </sup>
        </div>
      </div>
    </div>
  );
}

export default ColumnContainer;
