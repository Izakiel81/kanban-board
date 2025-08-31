<script setup lang="ts"></script>

<template>
  <div class="sidebar">
    <header>
      <img src="../../assets/logo.png" alt="logo" />
      <h1>Kanban board</h1>
    </header>
    <hr />
    <main>
      <ul>
        <li>Workspace 1</li>
        <li>Workspace 2</li>
        <li>Workspace 3</li>
      </ul>
    </main>
    <footer>
      <button>+ Add workspace</button>
    </footer>
  </div>
</template>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #f4f4f4;
  padding: 20px;

  font-family: "Poppins", sans-serif;
}
header {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;
}
header img {
  width: 100px;
  height: 100px;
}
header h1 {
  font-size: 25px;
  color: #333;
  text-align: center;
}
main {
  margin-top: 5px;
}
main ul {
  list-style: none;
  padding: 0;
}
</style>
