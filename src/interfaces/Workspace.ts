export interface Card {
  id: string;
  taskListId: string;
  title: string;
  description?: string;
}
export interface TaskList {
  id: string;
  workspaceId: string;
  title: string;
}
export interface Workspace {
  id: string;
  title: string;
}
