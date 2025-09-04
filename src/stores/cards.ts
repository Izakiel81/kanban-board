import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import { type Card } from "../interfaces/Workspace";

export const useCardsStore = defineStore("cards", () => {
  const cards: Ref<Card[]> = ref([]);

  function addCard(card: Card) {
    cards.value.push(card);
  }
  function editCard(card: Card) {
    const index = cards.value.indexOf(card);
    cards.value[index] = card;
  }
  function deleteCard(cardId: string) {
    cards.value.filter((card) => card.id !== cardId);
  }
  function cascadeDeleteCardsByTaskListId(taskListId: string) {
    cards.value.filter((card) => card.taskListId !== taskListId);
  }
  return {
    cards,
    addCard,
    editCard,
    deleteCard,
    cascadeDeleteCardsByTaskListId,
  };
});
