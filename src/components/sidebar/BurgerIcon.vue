<script setup lang="ts"></script>
<template>
  <span id="burger"> </span>
</template>
<style scoped>
#burger {
  position: relative;
  display: block;
  width: 20px;
  height: 1px;
  border-top: 3px solid #fff;
  border-radius: 4px;
  margin-top: 6px;
}
#burger::before,
#burger::after {
  content: "";
  position: absolute;
  width: 100%;
  border-top: 3px solid #fff;
  border-radius: 4px;
}

#burger::before {
  top: -9px;
}
#burger::after {
  top: 3px;
}
</style>
