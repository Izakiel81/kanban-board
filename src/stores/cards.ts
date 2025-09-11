import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import { type Card } from "../interfaces/Workspace";

export const useCardsStore = defineStore(
  "cards",
  () => {
    const cards: Ref<Card[]> = ref([]);

    function addCard(card: Card) {
      cards.value.push({ ...card, order: cards.value.length });
    }
    function editCard(card: Card) {
      const index = cards.value.findIndex((item) => item.id === card.id);
      cards.value[index] = card;
    }
    function deleteCard(cardId: string) {
      cards.value = cards.value.filter((card) => card.id !== cardId);
    }
    function getCardsByTaskListId(taskListId: string) {
      return cards.value.filter((card) => card.taskListId === taskListId);
    }
    function cascadeDeleteCardsByTaskListId(taskListId: string) {
      cards.value = cards.value.filter(
        (card) => card.taskListId !== taskListId,
      );
    }
    return {
      cards,
      addCard,
      editCard,
      deleteCard,
      getCardsByTaskListId,
      cascadeDeleteCardsByTaskListId,
    };
  },
  { persist: true },
);
