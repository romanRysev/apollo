<template>
  <section>
    <h1>{{ taskList.title }}</h1>
    <p v-for="task in taskList.tasks" :key="task.id">{{ task.text }}</p>
  </section>
</template>

<script>
export default {
  props: { taskList: { type: Object } },
};
</script>

<style></style>
