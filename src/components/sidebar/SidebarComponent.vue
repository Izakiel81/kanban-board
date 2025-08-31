<script setup lang="ts"></script>

<template>
  <div class="sidebar">
    <header>
      <img src="../../assets/logo.png" alt="logo" />
      <h1>Kanban board</h1>
      <hr />
    </header>
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
  display: flex;
  flex-direction: column;

  width: 250px;
  height: 100vh;
  background-color: #f4f4f4;

  font-family: "Poppins", sans-serif;
}
header {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;
  padding: 20px 20px 0;
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
header hr {
  width: 100%;
  margin-bottom: 15px;
}
main {
  flex-grow: 1;
  padding: 0 20px 20px;
}
main ul {
  list-style: none;
  padding: 0;
}
footer button {
  width: 100%;
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
}
</style>
