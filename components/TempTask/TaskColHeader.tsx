import { Column, Task } from "@/types/types";
import { useMemo } from "react";

interface TaskColHeaderProps {
  title: string;
  tasks: Task[];
  columns: Column[];
}
const TaskColHeader: React.FC<TaskColHeaderProps> = ({
  title,
  tasks,
  columns,
}) => {
  const columnCost = useMemo(() => {
    const columTasks = tasks.filter((task) =>
      columns.some((col) => col.id === task.columnId)
    );
    const columnCost = columTasks.reduce((currentColumnTotal, task) => {
      const taskCost = Number(task.price) || 0;
      return currentColumnTotal + taskCost;
    }, 0);
    return columnCost;
  }, [columns, tasks]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-mainBackgroundColor border-b border-r border-white p-4">
      <span>{title}</span>
      <span>{columnCost}$</span>
    </div>
  );
};

export default TaskColHeader;
