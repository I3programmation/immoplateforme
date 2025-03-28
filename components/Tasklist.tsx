"use client"; // Add this line at the top

import React, { useMemo, useState } from "react";
import {
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTask } from "@/components/SortableTask";
import { Add } from "@mui/icons-material";

import Grid from "@mui/material/Grid";
import { Task, TaskFormData, UpdateTaskData } from "@/types/types";

// Définition des props que TaskList attend
interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  deleteTask: (id: string) => void;

  onDoubleClick: (taskId: string) => void;
  onAdd: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  setTasks,
  deleteTask,

  onDoubleClick,
  onAdd,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskFormData | null>(null);

  // On utilise les tâches passées en prop pour générer la liste des identifiants
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  // Ce onDragEnd permet de réordonner les tâches de la TaskList uniquement.
  // Il met à jour l'état global via setTasks en remplaçant les tâches de la colonne "task-list-column".
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((task) => task.id === active.id);
    const newIndex = tasks.findIndex((task) => task.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    // Mise à jour uniquement pour les tâches de la TaskList (colonne "task-list-column")
    setTasks((prevTasks) => {
      // On extrait les tâches n'appartenant pas à la TaskList
      const otherTasks = prevTasks.filter(
        (task) => task.columnId !== "task-list-column"
      );
      // On réordonne les tâches de la TaskList
      const newColumnTasks = arrayMove(tasks, oldIndex, newIndex);
      return [...otherTasks, ...newColumnTasks];
    });
  }

  // Définition des sensors si besoin (optionnel, car DndContext global est défini dans TaskManager)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="pl-2 mt-4 w-full h-full ">
      <h2 className="flex text-2xl pr-4 justify-center items-center font-bold mb-4 border-b border-border">
        <span className="flex-grow text-center">Travaux</span>
        <Add className="ml-auto cursor-pointer" onClick={onAdd} />
      </h2>
      <div className="flex justify-center">
        <Grid
          container
          spacing={2}
          className="max-h-screen overflow-y-auto p-2"
        >
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task: Task) => (
              <Grid item xs={12} key={task.id}>
                <SortableTask
                  task={task}
                  deleteTask={() => deleteTask(task.id)}
                  onDoubleClick={() => onDoubleClick(task.id)}
                />
              </Grid>
            ))}
          </SortableContext>
        </Grid>
      </div>
    </div>
  );
};

export default TaskList;
