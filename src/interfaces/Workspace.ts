interface Base {
  id: string;
  title: string;
  order: number;
}
export interface Workspace extends Base {
  readonly type: "board";
  lists: Array<TaskList>;
}
export interface Card extends Base {
  readonly type: "card";
  description?: string;
}
export interface TaskList extends Base {
  readonly type: "list";
  cards: Array<Card>;
}
