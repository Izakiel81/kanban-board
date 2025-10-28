import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useAppStatesStore = defineStore(
  "app_states",
  () => {
    const currentBoardId: Ref<string> = ref("");
    const showSidebar: Ref<boolean> = ref(true);

    return {
      currentBoardId,
      showSidebar,
    };
  },
  { persist: true },
);
