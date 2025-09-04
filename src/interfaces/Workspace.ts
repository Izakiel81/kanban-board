export interface Card {
  id: string;
  title: string;
  description?: string;
}
export interface TaskList {
  id: string;
  title: string;
  cards?: Card[];
}
export interface Workspace {
  id: string;
  title: string;
  taskLists?: TaskList[];
}
