"use client";
import React, { useMemo, useState } from "react";
import { Building, Column, Task } from "./types";
import ColumnContainer from "./ColumnContainer";
import { SortableContext } from "@dnd-kit/sortable";
import TrashIcons from "../icons/TrashIcons";

interface BuildingContainerProps {
  building: Building;
  deleteBuilding: (id: string) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

function BuildingContainer(props: BuildingContainerProps) {
  const { building, deleteBuilding, tasks, setTasks } = props;

  const [columns, setColumns] = useState<Column[]>(building.columns);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const createTask = (columnId: string) => {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
      priority: "1",
      year: "2025",
      price: "",
      building: building.buildingName,
      buildingGroup: "",
      subgroup: "",
      discipline: "",
      description: "",
      tags: [],
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  };

  const updateTask = (id: string, content: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTasks(newTasks);
  };

  const generateId = (): string => Math.floor(Math.random() * 1000).toString();

  const deleteColumn = (id: string) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((task) => task.columnId !== id);
    setTasks(newTasks);
  };

  const updateColumn = (id: string, title: string) => {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumns);
  };

  return (
    <div className="flex flex-wrap items-center overflow-x-auto overflow-y-hidden ">
      <div className="m-auto flex">
        <div
          className="
              bg-mainBackgroundColor 
              border-2 
              border-white
              p-4
              flex  
              w-[250px]
             
              "
        >
          <div className="flex flex-col ">
            <h2 className="text-3xl font-semibold">{building.buildingName}</h2>
            <h3 className="text-xl font-thin">{building.buildingGroup}</h3>
            <h3 className="text-xl font-thin">{building.subgroup}</h3>
          </div>
          <button
            className="flex justify-end items-end"
            onClick={() => deleteBuilding(building.id)}
          >
            <TrashIcons />
          </button>
        </div>
        <div className="flex">
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <ColumnContainer
                key={col.id}
                column={col}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                tasks={tasks.filter((task) => task.columnId === col.id)}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}

export default BuildingContainer;
