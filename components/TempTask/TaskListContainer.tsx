"use client";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcons";
import { Column, Task } from "./types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  createTask: (columnId: string) => void;
  tasks: Task[];
  deleteTask: (id: string) => void;
  updateTask: (id: string, content: string) => void;
  style?: React.CSSProperties;
}

function TaskListContainer(props: Props) {
  const { column, createTask, tasks, deleteTask, updateTask, style } = props;

  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "Column", column },
    disabled: editMode,
  });

  const containerStyle = {
    ...style,
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={containerStyle}
        className="bg-columnBackgroundColor w-[250px] max-h-[500px] rounded-md flex flex-col opacity-40 border-2 border-rose-500 "
      >
        {" "}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={containerStyle}
      className="bg-columnBackgroundColor w-[400px] max-h-screen rounded-md flex flex-col text-white"
    >
      {/* Column header */}
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-backgoundColor hover:text-rose-500 active:bg-black"
        onClick={() => createTask(column.id)}
      >
        <PlusIcon />
        Add task
      </button>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto border-2 border-white">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
    </div>
  );
}

export default TaskListContainer;
