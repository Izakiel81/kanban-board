import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useModalStore = defineStore("modal_store", () => {
  const modalIsActive: Ref<boolean> = ref(false);
  const activeContextMenuId: Ref<string> = ref("");

  return {
    modalIsActive,
    activeContextMenuId,
  };
});
