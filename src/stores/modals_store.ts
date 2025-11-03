import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useModalStore = defineStore("modals_store", () => {
  const modalIsActive: Ref<boolean> = ref(false);

  return {
    modalIsActive,
  };
});
