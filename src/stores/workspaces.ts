import { defineStore } from "pinia";
import findMaxOrder from "./utils/findMaxOrder";
import {
  type Card,
  type TaskList,
  type Workspace,
} from "../interfaces/Workspace";
import { type Ref, ref } from "vue";
import { v4 as uuid } from "uuid";

export const useWorkspacesStore = defineStore(
  "workspaces",
  () => {
    const workspaces: Ref<Workspace[]> = ref([]);

    function getBoardById(id: string): Workspace | undefined {
      const boardResult = workspaces.value.find((item) => item.id === id);
      if (!boardResult) {
        console.error("Board is not found", "Board id: ", id);
        return;
      }
      return boardResult;
    }

    function getTaskListById(
      board: Workspace,
      id: string,
    ): TaskList | undefined {
      const taskListResult = board.lists.find((item) => item.id === id);
      if (!taskListResult) {
        console.error("List is not found", "List id: ", id);
        return;
      }
      return taskListResult;
    }

    function getCardById(taskList: TaskList, id: string): Card | undefined {
      const cardResult = taskList.cards.find((item) => item.id === id);
      if (!cardResult) {
        console.error("Card is not found", "Card id: ", id);
        return;
      }
      return cardResult;
    }

    function addWorkspace(workspace?: { id: string; title: string }) {
      let biggestOrder = findMaxOrder(workspaces.value);
      workspaces.value.push({
        ...(workspace ?? {
          id: uuid(),
          title: "Board " + (workspaces.value.length + 1),
          length,
        }),
        order: biggestOrder + 1,
        type: "board",
        lists: [],
      });
    }

    function editWorkspace(workspace: Workspace) {
      const index = workspaces.value.findIndex(
        (item) => item.id === workspace.id,
      );
      workspaces.value[index] = workspace;
    }
    function deleteItem(id: string, list: Array<Workspace | TaskList | Card>) {
      const index = list.findIndex((item) => item.id === id);
      if (index === -1) return;
      list.splice(index, 1);
    }
    function removeWorkspace(id: string) {
      workspaces.value = workspaces.value = workspaces.value.filter(
        (workspace) => workspace.id !== id,
      );
    }

    function addTaskList(boardId: string, newListTitle: string) {
      const board = getBoardById(boardId);
      if (!board) return;
      const biggestOrder = findMaxOrder(board.lists);
      board.lists.push({
        id: uuid(),
        title: newListTitle,
        order: biggestOrder + 1,
        type: "list",
        cards: [],
      });
    }

    function addCard(
      boardId: string,
      taskListId: string,
      newCardTitle: string,
    ) {
      const boardIndex = workspaces.value.findIndex(
        (item) => item.id === boardId,
      );
      if (boardIndex === -1) {
        console.error("board is not found");
        return;
      }
      const taskListIndex = workspaces.value[boardIndex].lists.findIndex(
        (item) => item.id === taskListId,
      );
      if (taskListIndex === -1) {
        console.error("list is not found");
        return;
      }
      const biggestOrder = findMaxOrder(
        workspaces.value[boardIndex].lists[taskListIndex].cards,
      );
      workspaces.value[boardIndex].lists[taskListIndex].cards.push({
        id: uuid(),
        title: newCardTitle,
        taskListId,
        type: "card",
        order: biggestOrder + 1,
      });
    }

    function editTaskList(
      boardId: string,
      taskListId: string,
      newTaskList: TaskList,
    ) {
      const boardIndex = workspaces.value.findIndex(
        (item) => item.id === boardId,
      );
      if (boardIndex === -1) {
        console.error("board is not found");
        return;
      }
      const taskListIndex = workspaces.value[boardIndex].lists.findIndex(
        (item) => item.id === taskListId,
      );
      if (taskListIndex === -1) {
        console.error("list is not found");
        return;
      }
      workspaces.value[boardIndex].lists[taskListIndex] = newTaskList;
    }
    function editCard(
      boardId: string,
      taskListId: string,
      cardId: string,
      newCard: Card,
    ) {
      const boardIndex = workspaces.value.findIndex(
        (item) => item.id === boardId,
      );
      if (boardIndex === -1) {
        console.error("board is not found");
        return;
      }
      const taskListIndex = workspaces.value[boardIndex].lists.findIndex(
        (item) => item.id === taskListId,
      );
      if (taskListIndex === -1) {
        console.error("list is not found");
        return;
      }
      const cardIndex = workspaces.value[boardIndex].lists[
        taskListIndex
      ].cards.findIndex((item) => item.id === cardId);
      if (cardIndex === -1) {
        console.error("card is not found");
        return;
      }

      workspaces.value[boardIndex].lists[taskListIndex].cards[cardIndex] =
        newCard;
    }

    return {
      workspaces,
      getBoardById,
      addWorkspace,
      addTaskList,
      addCard,
      editWorkspace,
      editTaskList,
      editCard,
      removeWorkspace,
      deleteItem,
    };
  },
  { persist: true },
);
