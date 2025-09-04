export interface Card {
  title: string;
  description?: string;
}
export interface TaskList {
  title: string;
  cards?: Card[];
}
export interface Workspace {
  title: string;
  taskLists?: TaskList[];
}
