import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Divider from "@mui/material/Divider";
import { Task } from "@/types/types";

interface SortableTaskProps {
  task: Task;
  deleteTask: (id: string) => void;
  onDoubleClick: () => void;
  showDetails?: boolean;
  isDragOverlay?: boolean;
}

export const SortableTask: React.FC<SortableTaskProps> = ({
  task,
  deleteTask,
  onDoubleClick,
  showDetails = true,
  isDragOverlay = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,

    // Si on est en mode drag (et pas dans l'overlay), on masque l'élément tout en gardant son espace
    opacity: isDragging && !isDragOverlay ? 0.5 : 1,
    // On conserve toujours "relative" pour que l'espace de l'élément soit préservé
    position: "relative",
    width: "100%",
    maxWidth: "230px",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: isDragging ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none",
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 1 && priority <= 6) return "bg-green-500";
    if (priority >= 7 && priority <= 11) return "bg-orange-500";
    if (priority >= 12 && priority <= 15) return "bg-red-500";
    return "bg-gray-300";
  };

  const getDisciplineBorderColor = (discipline: number) => {
    switch (discipline) {
      case 1:
        return "border-blue-500";
      case 2:
        return "border-green-500";
      case 3:
        return "border-red-500";
      case 4:
        return "border-yellow-500";
      case 5:
        return "border-purple-500";
      case 6:
        return "border-indigo-500";
      default:
        return "border-gray-300";
    }
  };

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`flex items-center justify-between border-2 mt-2 rounded-sm touch-action-none ${getDisciplineBorderColor(
        Number(task.discipline)
      )}`}
      onDoubleClick={onDoubleClick}
    >
      <div className="ml-2 text-gray-700 w-[60%] overflow-hidden">
        {task.content}
      </div>
      {showDetails && (
        <div className="flex items-center w-[40%] overflow-hidden">
          <Divider
            orientation="vertical"
            flexItem
            className="m-0 p-0"
            style={{ width: "2px", backgroundColor: "rgba(0,0,0,0.1)", border: "none" }}
          />
          <div className="flex flex-col w-full items-end text-gray-500 m-0 p-0 pr-2 gap-2">
            <div className="pt-2 m-0">{task.price}$</div>

            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full text-white flex items-center mb-1 justify-center ${getPriorityColor(
                Number(task.discipline)
              )}`}
            >
              <span className="text-sm leading-none">{task.priority}</span>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};
