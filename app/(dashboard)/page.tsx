"use client";
import { useState } from "react";
import { Task, UpdateTaskData, TaskFormData } from "@/types/types";
import Modal from "@/components/Modal";
import TaskList from "@/components/Tasklist";
import TaskManager from "@/components/TempTask/TaskManager";
import TaskListContainer from "@/components/TempTask/TaskListContainer";

export default function Home() {
  return (
    <div className="flex w-[1000px] flex-col pl-10 ">
      <div className="flex absolute top-20  flex-col  ">
        <TaskManager />
      </div>
    </div>
  );
}
