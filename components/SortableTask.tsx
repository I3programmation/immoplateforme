import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { RiDeleteBin6Line } from "react-icons/ri";
import Divider from "@mui/material/Divider";
import { Task } from "@/types/types";

interface SortableTaskProps {
  task: Task;
  deleteTask: (id: string) => void;
  onDoubleClick: () => void;
  showDetails?: boolean; // New prop to control the display of task details
}

export const SortableTask: React.FC<SortableTaskProps> = ({
  task,
  deleteTask,
  onDoubleClick,
  showDetails = true, // Default to true if not provided
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    overflow: "hidden", // Ensure content does not overflow
    boxSizing: "border-box", // Include padding and border in the element's total width and height
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 1 && priority <= 6) {
      return "bg-green-500";
    } else if (priority >= 7 && priority <= 11) {
      return "bg-orange-500";
    } else if (priority >= 12 && priority <= 15) {
      return "bg-red-500";
    } else {
      return "bg-gray-300"; // Default color
    }
  };

  const getDisciplineBorderColor = (discipline: number) => {
    switch (discipline) {
      case 1:
        return "border-blue-500";
      case 2:
        return "border-green-500";
      case 3:
        return "border-red-500";
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
            sx={{ borderColor: "var(--foreground)" }}
          />
          <div className="flex flex-col w-full items-center text-gray-500 m-0 p-0">
            <div className="p-2 m-0">{task.price}$</div>
            <Divider
              flexItem
              className="m-0 p-0"
              sx={{ borderColor: "var(--foreground)" }}
            />
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full text-white flex items-center my-1 justify-center ${getPriorityColor(
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
