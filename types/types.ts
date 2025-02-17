export interface UpdateTaskData {
  content?: string;
  priority?: string;
  price?: number;
  discipline?: string;
  description?: string;
  columnId?: string;
  tags?: {
    connect?: string[]; // IDs des tags à connecter
    disconnect?: string[]; // IDs des tags à déconnecter
    set?: string[]; // IDs des tags à définir
  };
}

export interface Task {
  id: string;
  content: string;
  priority: string;
  price: number | ""; // Permet de gérer le cas où l'input est vide
  discipline: string;
  description: string;
  columnId: string;
  tags: string[]; // Stocke les IDs des tags
}
export interface Building {
  id: string;
  buildingName: string;
  buildingGroup: string;
  subgroup: string;
}

export interface Column {
  id: string;
  title: string;
  year: number;
  buildingId: string;
  tasks?: Task[];
}

export interface TaskFormData {
  task: Task;
  column: Column;
  building: Building;
}

export interface TaskListColumn {
  id: string;
  title: string;
  tasks: Task[];
}
