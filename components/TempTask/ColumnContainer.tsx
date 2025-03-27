"use client";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column, Task } from "@/types/types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { SortableTask } from "@/components/SortableTask";

interface ColumnContainerProps {
  column: Column;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  deleteTask: (id: string) => void;

  onDoubleClick: (taskId: string) => void;
}

function ColumnContainer({
  column,
  tasks,

  deleteTask,
  onDoubleClick,
}: ColumnContainerProps) {
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const totalCost = useMemo(
    () =>
      tasks.reduce((currentTotal, task) => {
        const taskCost = Number(task.price) || 0;
        return currentTotal + taskCost;
      }, 0),
    [tasks]
  );

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
        className="bg-columnBackgroundColor w-[250px] h-[300px] max-h-[500px]  flex flex-col opacity-40 border-2 border-rose-500"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor w-[250px] h-[300px] max-h-[500px]  flex flex-col"
    >
      {/* Column Task Container */}
      <div className="flex flex-grow max-h-[300px] flex-col p-2 border-b border-r border-white">
        <div className="flex flex-grow flex-col gap-4 overflow-x-hidden overflow-y-auto">
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
        </div>
        <span className="self-end mt-auto">{totalCost}$</span>
      </div>
    </div>
  );
}

export default ColumnContainer;
