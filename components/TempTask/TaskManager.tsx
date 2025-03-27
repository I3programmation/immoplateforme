"use client";
import { useState, useEffect, useRef } from "react";
import "./App.css";
import BuildingKanbanBoard from "./BuildingKanbanBoard";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import TaskList from "../Tasklist";
import {
  Task,
  Column,
  TaskListColumn,
  TaskFormData,
  UpdateTaskData,
} from "@/types/types";
import Modal from "../Modal";
import { createPortal } from "react-dom";
import { SortableTask } from "../SortableTask";
import { Drawer, IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskFormData | null>(null);
  const [undoStack, setUndoStack] = useState<
    { taskId: string; prevColumnId: string }[]
  >([]);
  // draggedTaskId is the id of the task currently being dragged.
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  // A ref to store the previous columnId of a task by its id.
  const prevColumnRef = useRef<{ [key: string]: string }>({});
  const [displayTasks, setDisplayTasks] = useState<Task[]>([]);
  const [initialColumnId, setInitialColumnId] = useState<string | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerWidth = 300;

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("/api/tasks");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des tâches");
        }
        const tasksFromDb = await response.json();
        setTasks(tasksFromDb);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTasks();
  }, []);

  useEffect(() => {
    setDisplayTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } })
  );

  // Définir la colonne "TaskList" par son identifiant constant
  const columnId: string = "task-list-column";
  const column: TaskListColumn = {
    id: columnId,
    title: "Task List",
    tasks: tasks.filter((task) => task.columnId === columnId),
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: TaskFormData) => {
    try {
      const response = await fetch("/api/task/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (response.ok) {
        const savedTask = await response.json();

        alert("Tâche enregistrée avec succès !");
        setTasks([...tasks, savedTask]);
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de l'enregistrement de la tâche", errorData);
        alert(`Erreur: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erreur de connexion", error);
      alert("Une erreur de connexion s'est produite.");
    }
  };

  const handleDoubleClick = async (taskId: string) => {
    try {
      const response = await fetch(`/api/task/${taskId}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de la tâche");
      }
      const data: TaskFormData = await response.json();
      setSelectedTask(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Erreur fetch task", error);
    }
  };

  const handleUpdateTask = async (
    taskId: string,
    updatedData: UpdateTaskData
  ) => {
    try {
      const response = await fetch(`/api/task/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: updatedData }),
      });
      if (response.ok) {
        const updatedTask = await response.json();

        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        );
      } else {
        const errorData = await response.json();
        console.error("❌ Error updating task", errorData);
      }
    } catch (error) {
      console.error("❌ Connection error", error);
    }
  };

  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    setIsModalOpen(false);
  };

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Task") {
      const id = event.active.id.toString();
      setActiveTask(event.active.data.current.task);
      setDraggedTaskId(id);

      const activeTaskItem = tasks.find((t) => t.id === id);
      if (activeTaskItem) {
        setInitialColumnId(activeTaskItem.columnId); // ✅ Store the initial column
        console.log(`🎯 Initial Column for ${id}: ${activeTaskItem.columnId}`);
      }
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    const isOverAColumn = over.data.current?.type === "Column";

    if (!isActiveATask) return;

    setDisplayTasks((prevTasks) => {
      const activeIndex = prevTasks.findIndex((t) => t.id === activeId);
      if (activeIndex === -1) return prevTasks;

      let newColumnId = prevTasks[activeIndex].columnId;

      if (isOverATask) {
        const overIndex = prevTasks.findIndex((t) => t.id === overId);
        if (prevTasks[activeIndex].columnId === prevTasks[overIndex].columnId) {
          console.log(
            `🔄 Reordering task ${activeId} inside column ${newColumnId}`
          );
          return arrayMove(prevTasks, activeIndex, overIndex);
        }
      } else if (isOverAColumn) {
        newColumnId = overId.toString();
        console.log(`🛠 Moving task ${activeId} to column ${newColumnId}`);
      }

      return prevTasks.map((task, index) =>
        index === activeIndex ? { ...task, columnId: newColumnId } : task
      );
    });
  }

  function onDragEnd(event: DragEndEvent) {
    console.log("🔹 onDragEnd triggered", event);

    const { active, over } = event;
    console.log("🛠 `onDragEnd` fired, checking drop target:", over);

    setTimeout(() => {
      setActiveTask(null);
    }, 100);

    if (!over) {
      console.warn("⚠️ Task dropped outside any valid column!");
      setDraggedTaskId(null);
      setDisplayTasks(tasks);
      return;
    }

    const activeId = active.id.toString();
    const activeTaskItem = displayTasks.find((t) => t.id === activeId);

    if (!activeTaskItem) {
      console.error("🚨 Task not found in `displayTasks`!");
      setDraggedTaskId(null);
      setDisplayTasks(tasks);
      return;
    }

    console.log(
      `🔍 Checking task ${activeId} before moving... Initial Column: ${initialColumnId}, Current Column: ${activeTaskItem.columnId}`
    );

    let newColumnId = activeTaskItem.columnId;
    let newTasksOrder = [...displayTasks];

    if (over.data.current?.type === "Column") {
      newColumnId = over.id.toString();
      console.log(`🛠 Dropped in a column: New Column ID = ${newColumnId}`);
    } else if (over.data.current?.type === "Task") {
      const overTaskId = over.id.toString();
      const overTaskItem = displayTasks.find((t) => t.id === overTaskId);
      if (overTaskItem) {
        newColumnId = overTaskItem.columnId;
        console.log(`🛠 Dropped on a task: Keeping column ${newColumnId}`);

        // 🔥 Reorder the tasks within the column
        const activeIndex = newTasksOrder.findIndex((t) => t.id === activeId);
        const overIndex = newTasksOrder.findIndex((t) => t.id === overTaskId);
        if (activeIndex !== -1 && overIndex !== -1) {
          console.log(`🔄 Saving new order for column ${newColumnId}`);
          newTasksOrder = arrayMove(newTasksOrder, activeIndex, overIndex);
        }
      }
    }

    console.log(
      `🔄 Task ${activeId} attempting move: Initial Column = ${initialColumnId}, New Column = ${newColumnId}`
    );

    if (newColumnId !== initialColumnId || newTasksOrder !== displayTasks) {
      console.log(`✅ Task ${activeId} moved or reordered`);
      updateTaskColumn(activeId, newColumnId);
    } else {
      console.warn(`🚨 Task ${activeId} did NOT move!`);
    }

    // ✅ Save the new order in `tasks`
    setTasks(newTasksOrder);

    setDraggedTaskId(null);
    setInitialColumnId(null);

    // ✅ Ensure `displayTasks` updates to match `tasks`
    setTimeout(() => {
      setDisplayTasks(newTasksOrder);
    }, 100);
  }

  // Fonction helper pour mettre à jour le columnId et gérer l'undo
  const updateTaskColumn = async (taskId: string, newColumnId: string) => {
    const oldTask = tasks.find((task) => task.id === taskId);
    if (!oldTask) return;
    setUndoStack((prev) => [
      ...prev,
      { taskId, prevColumnId: oldTask.columnId },
    ]);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, columnId: newColumnId } : task
      )
    );
    try {
      await fetch(`/api/task/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columnId: newColumnId }),
      });
    } catch (error) {
      console.error("❌ Error updating task:", error);
    }
  };

  const undoLastMove = async () => {
    if (undoStack.length === 0) return;
    const lastChange = undoStack.pop();
    if (!lastChange) return;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === lastChange.taskId
          ? { ...task, columnId: lastChange.prevColumnId }
          : task
      )
    );
    try {
      await fetch(`/api/task/${lastChange.taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columnId: lastChange.prevColumnId }),
      });
    } catch (error) {
      console.error("❌ Error undoing task move:", error);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        sensors={sensors}
      >
        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          variant="persistent"
          PaperProps={{
            sx: {
              width: `${drawerWidth}px`,
              mt: "60px",
            },
          }}
        >
          <TaskList
            tasks={displayTasks.filter(
              (task) => task.columnId === "task-list-column"
            )}
            setTasks={setTasks}
            deleteTask={handleRemoveTask}
            onDoubleClick={handleDoubleClick}
            onAdd={handleAddTask}
          />
        </Drawer>

        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className={`fixed top-[150px] transform -translate-y-1/2 bg-primaryColor rounded-r-lg shadow-md w-10 h-20 z-[1300] transition-all duration-200 ${
            isDrawerOpen ? `left-[${drawerWidth}px]` : "left-0"
          } hover:opacity-80`}
        >
          {isDrawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </button>

        <div className="flex justify-center w-full h-full">
          <BuildingKanbanBoard
            tasks={displayTasks} // ✅ Use displayTasks for smooth UI updates
            setTasks={setTasks}
            deleteTask={handleRemoveTask}
            onDoubleClick={handleDoubleClick}
          />
        </div>

        {createPortal(
          <DragOverlay style={{ pointerEvents: "none" }}>
            {activeTask && (
              <SortableTask
                key={activeTask.id}
                task={activeTask}
                deleteTask={handleRemoveTask}
                onDoubleClick={() => handleDoubleClick(activeTask.id)}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
      {isModalOpen && (
        <Modal
          onSave={(taskData: TaskFormData) => {
            if (taskData.task.id && taskData.task.id.trim() !== "") {
              const updateData: UpdateTaskData = {
                content: taskData.task.content,
                priority: taskData.task.priority,
                price: taskData.task.price,
                discipline: taskData.task.discipline,
                description: taskData.task.description,
                columnId: taskData.column.id,
                buildingId: taskData.building.id,
                tags: { connect: taskData.task.tags },
                index: taskData.task.index,
              };
              handleUpdateTask(taskData.task.id, updateData);
            } else {
              handleSaveTask(taskData);
            }
          }}
          onClose={() => setIsModalOpen(false)}
          onRemove={handleRemoveTask}
          isOpen={isModalOpen}
          task={selectedTask}
        />
      )}
    </div>
  );
}

export default TaskManager;
