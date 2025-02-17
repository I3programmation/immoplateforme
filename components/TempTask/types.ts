export type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

export type Task = {
  id: string;
  columnId: string;
  content: string;
  priority: string;
  year: string;
  price: string;
  building: string;
  buildingGroup: string;
  subgroup: string;
  discipline: string;
  description: string;
  tags: string[];
};

export type Building = {
  id: string;
  buildingName: string;
  buildingGroup: string;
  subgroup: string;
  columns: Column[];
};
