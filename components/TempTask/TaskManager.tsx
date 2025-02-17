"use client";
import { useState } from "react";
import "./App.css";
import BuildingKanbanBoard from "./BuildingKanbanBoard";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverEvent,
} from "@dnd-kit/core";
import { Task, Column } from "./types";
import TaskListContainer from "./TaskListContainer";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { arrayMove } from "@dnd-kit/sortable";
import { Button, Drawer } from "@mui/material";
import TaskList from "../Tasklist";

function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } })
  );

  const generateId = (): string => Math.floor(Math.random() * 1000).toString();

  const columnId: string = "task-list-column";
  // Define a column object with a unique ID
  const column: Column = {
    id: columnId,
    title: "Task List",
    tasks: tasks.filter((task) => task.columnId === columnId),
  };

  const createTask = () => {
    const newTask: Task = {
      id: generateId(),
      columnId: column.id,
      content: `Task ${tasks.length + 1}`,
      priority: "1",
      year: "2025",
      price: "",
      building: "",
      buildingGroup: "",
      subgroup: "",
      discipline: "",
      description: "",
      tags: [],
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTask = (id: string, content: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, content } : task))
    );
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    // Dropping a task over another task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex(
          (task) => task.id === active.id
        );
        const overTaskIndex = tasks.findIndex((task) => task.id === over.id);

        tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;

        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    }

    // Dropping a task over a column
    const isOverColumn = over.data.current?.type === "Column";
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex(
          (task) => task.id === active.id
        );

        tasks[activeTaskIndex].columnId = overColumnId.toString();
        return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
      });
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setIsDrawerOpen(open);
    };

  return (
    <div className="flex h-screen w-screen ">
      <DndContext
        onDragOver={onDragOver}
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="flex absolute top-4 left-4 w-full h-full">
          {/* <div>
            <Button onClick={toggleDrawer(true)}>Open Task List</Button>
          </div>
          <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={toggleDrawer(false)}
            slotProps={{
              backdrop: { style: { backgroundColor: "transparent" } },
            }}
          >
            <TaskListContainer
              column={column}
              createTask={createTask}
              tasks={tasks.filter((task) => task.columnId === column.id)}
              deleteTask={deleteTask}
              updateTask={updateTask}
              style={{ height: "100%" }}
            />
          </Drawer> */}
          <TaskList />
          <div className="flex justify-center w-full h-full">
            <BuildingKanbanBoard tasks={tasks} setTasks={setTasks} />
          </div>
        </div>
        {/* {createPortal(
          <DragOverlay>
            {activeColumn && (
              <TaskListContainer
                column={activeColumn}
                createTask={createTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
            {activeTask && (
              <TaskCard
                deleteTask={deleteTask}
                updateTask={updateTask}
                task={activeTask}
              />
            )}
          </DragOverlay>,
          document.body
        )} */}
      </DndContext>
    </div>
  );
}

export default TaskManager;
