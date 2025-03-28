"use client";
import { useState } from "react";
import { Task, UpdateTaskData, TaskFormData } from "@/types/types";
import Modal from "@/components/Modal";
import TaskList from "@/components/Tasklist";
import TaskManager from "@/components/TempTask/TaskManager";
import TaskListContainer from "@/components/TempTask/TaskListContainer";

export default function Home() {
  return (
    <div className="flex w-screen flex-col ">
      <div className="flex  flex-col  ">
        <TaskManager />
      </div>
    </div>
  );
}
