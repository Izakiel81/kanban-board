interface Base {
  id: string;
  title: string;
  order: number;
}
export interface Workspace extends Base {
  readonly type: "board";
}
export interface Card extends Base {
  taskListId: string;
  description?: string;
  readonly type: "card";
}
export interface TaskList extends Base {
  workspaceId: string;
  readonly type: "list";
}
