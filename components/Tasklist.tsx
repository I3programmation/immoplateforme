"use client"; // Add this line at the top

import React, { useState, useEffect, useMemo } from "react";

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
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTask } from "@/components/SortableTask";
import { Add } from "@mui/icons-material";
import Modal from "./Modal";
import Grid from "@mui/material/Grid";
import { Task, TaskFormData, UpdateTaskData, Column } from "@/types/types";

const TaskList: React.FC = () => {
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskFormData | null>(null);

  const taskIds = useMemo(() => tasksList.map((task) => task.id), [tasksList]);

  const updateTask = async (taskId: string, updatedData: UpdateTaskData) => {
    try {
      const response = await fetch(`/api/task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Définir le type de contenu en JSON
        },
        body: JSON.stringify(updatedData), // Sérialiser les données à envoyer
      });

      if (response.ok) {
        const updatedTask = await response.json(); // Récupérer la réponse JSON
        console.log("✅ Tâche mise à jour :", updatedTask);
        alert("Tâche mise à jour avec succès !");
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de la mise à jour de la tâche", errorData);
        alert(
          `Erreur lors de la mise à jour de la tâche: ${errorData.message}`
        );
      }
    } catch (error) {
      console.error("Erreur de connexion", error);
      alert("Une erreur de connexion s'est produite.");
    }
  };

  const handleUpdate = () => {
    updateTask("8345d568-61b9-48dc-8411-cf8326e9c89a", {
      priority: "Haute", // Changer la priorité de la tâche
      tags: {
        connect: ["da73da6c-a2ed-4270-9d22-d49aed031537"], // ajouter le tag avec l'ID "tag1" de la tâche
      },
    });
  };
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des tâches");
        }
        const tasks = await response.json();
        console.log("Tasks:", tasks);
        setTasksList(tasks);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, []);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id === over?.id) {
      return;
    }

    setTasksList((tasks) => {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over?.id);
      return arrayMove(tasks, oldIndex, newIndex);
    });
  }

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

  const removeTask = async (id: string) => {
    console.log(`Removing task with id: ${id}`);
    const response = await fetch("/api/remove-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setTasksList(tasksList.filter((task) => task.id !== id));
    }
  };

  const handleDoubleClick = (task: TaskFormData) => {
    setSelectedTask(task);
    setisModalOpen(true);
  };

  const handleSaveTask = async (task: TaskFormData) => {
    try {
      const response = await fetch("/api/task/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        const savedTask = await response.json();
        console.log("✅ Tâche enregistrée :", savedTask);
        alert("Tâche enregistrée avec succès !");
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de l'enregistrement de la tâche", errorData);
        alert(
          `Erreur lors de l'enregistrement de la tâche: ${errorData.message}`
        );
      }
    } catch (error) {
      console.error("Erreur de connexion", error);
      alert("Une erreur de connexion s'est produite.");
    }
  };
  const handleRemoveTask = (id: string) => {
    console.log("Removing task with ID:", id);
    // Remove the task
  };

  return (
    <div className=" pl-2 mt-4 w-[30%]  ">
      <h2 className="flex text-2xl pr-4 justify-center items-center font-bold mb-4 border-b border-border">
        <span className="flex-grow text-center  ">Travaux</span>
        <Add
          className="ml-auto cursor-pointer"
          onClick={() => setisModalOpen(true)}
        />
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
            {tasksList.map((task: Task) => (
              <Grid item xs={12} key={task.id}>
                <SortableTask
                  key={task.id}
                  task={task}
                  deleteTask={() => removeTask(task.id)}
                  onDoubleClick={() =>
                    selectedTask && handleDoubleClick(selectedTask)
                  }
                />
              </Grid>
            ))}
          </SortableContext>
        </Grid>
      </div>
      {isModalOpen && (
        <Modal
          onSave={handleSaveTask}
          onClose={() => setisModalOpen(false)}
          onRemove={handleRemoveTask}
          isOpen={isModalOpen}
          task={selectedTask}
        />
      )}
    </div>
  );
};

export default TaskList;
