<script setup lang="ts">
import { ref } from "vue";
import { useModalStore } from "../../stores/modals_store";

interface Item {
  title: string;
  onClick: () => void;
}

const modalStore = useModalStore();

const { items, dots_click, show, theme, position } = defineProps<{
  items: Array<Item>;
  dots_click: () => void;
  show: boolean;
  theme?: string;
  position?: { top: number; left: number };
}>();
</script>
<template>
  <div class="context-menu-container">
    <span
      :class="['context-menu-dots', theme ? 'light' : '']"
      @click.stop="dots_click"
    />
    <div
      :class="['context-menu-items-container', theme ? 'light' : '']"
      v-if="show"
      :style="{ top: position?.top + 'px', left: position?.left + 'px' }"
    >
      <span
        :class="['context-menu-item', theme ? 'light' : '']"
        v-for="item in items"
        @click.prevent.stop="
          () => {
            item.onClick();
            modalStore.activeContextMenuId = '';
          }
        "
        >{{ item.title }}</span
      >
    </div>
  </div>
</template>
<style scoped>
.context-menu-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.light {
  background-color: #fafafa !important;
  color: #252525;
  border-radius: 2px;
}

.context-menu-items-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 2;
  top: 15px;
  left: -60px;
  width: 70px;

  background-color: #3e3e3e;
  color: #fff;
  border-radius: 2px;
}

.context-menu-item {
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 2px 5px;
}
.context-menu-item:active {
  filter: brightness(1.2);
}
.context-menu-dots {
  position: relative;
  width: 5px;
  height: 5px;

  background-color: #3e3e3e;
  border-radius: 100%;
}

.context-menu-dots::before,
.context-menu-dots::after {
  content: "";
  position: absolute;
  right: 8px;
  width: 5px;
  height: 5px;

  background-color: inherit;
  border-radius: 100%;
}
.context-menu-dots::after {
  right: 16px;
}
@media (min-width: 1024px) and (pointer: fine) {
  .context-menu-container {
    display: none;
  }
}
</style>
