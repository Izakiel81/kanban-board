export interface Workspace {
  id: string;
  title: string;
  order: number;
}
export interface Card extends Workspace {
  taskListId: string;
  description?: string;
}
export interface TaskList extends Workspace {
  workspaceId: string;
}
