<template>
  <section>
    <h1 v-if="disabled">{{ taskList.title }}</h1>
    <v-text-field v-else v-model="taskList.title" label="Название" />
    <Task
      v-for="task in list()"
      :key="task.id"
      :task="task"
      :disabled="disabled"
      @delete="onDelete"
    />
    <v-icon @click="onAdding" v-if="!disabled">mdi-plus</v-icon>
    <p v-if="cropped">...</p>
  </section>
</template>

<script>
import Task from "@/components/Task.vue";
import shortid from "shortid";
export default {
  components: { Task },
  props: {
    taskList: { type: Object },
    short: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      cropped: false,
    };
  },
  methods: {
    list() {
      if (this.short) {
        if (this.taskList.tasks.length > 3) {
          this.cropped = true;
        }
        return this.taskList.tasks.slice(0, 3);
      } else return this.taskList.tasks;
    },
    onAdding() {
      const newTask = {
        __typename: "Task",
        text: "",
        done: false,
      };

      newTask.id = shortid.generate();

      this.taskList.tasks.push(newTask);
      this.$store.commit("addToChangesStack", {
        listId: this.taskList.id,
        mode: "new task",
        taskId: newTask.id,
      });
    },
    onDelete(task) {
      this.taskList.tasks.splice(this.taskList.tasks.indexOf(task), 1);
    },
  },
};
</script>

<style></style>
