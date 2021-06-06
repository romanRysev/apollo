<template>
  <section>
    <h1 v-if="disabled">{{ taskList.title }}</h1>
    <v-text-field
      v-else
      label="Название"
      :value="tasks.title"
      @input="onTitleInput"
    />
    <Task
      v-for="task in list()"
      :key="task.id"
      :task="task"
      :disabled="disabled"
      @delete="onDelete"
      @change="$emit('change', tasks)"
    />
    <v-icon @click="onAdding" v-if="!disabled">mdi-plus</v-icon>
    <p v-if="cropped">...</p>
  </section>
</template>

<script>
import Task from '@/components/Task.vue'
import shortid from 'shortid'
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
      tasks: this.taskList,
    }
  },
  beforeUpdate() {
    console.log('upd')
    this.tasks = this.taskList
  },
  methods: {
    list() {
      if (this.short && this.tasks.tasks.length > 3) {
        this.cropped = true
        return this.tasks.tasks.slice(0, 3)
      } else {
        this.cropped = false
        return this.tasks.tasks
      }
    },
    onAdding() {
      const newTask = {
        __typename: 'Task',
        text: '',
        done: false,
      }

      newTask.id = shortid.generate()

      this.tasks.tasks.push(newTask)
      this.$store.dispatch('addToChangesStack', {
        listId: this.tasks.id,
        mode: 'new task',
        task: newTask,
      })
      this.$emit('change', this.tasks)
    },
    onDelete(task) {
      this.$store.dispatch('addToChangesStack', {
        listId: this.tasks.id,
        mode: 'delete task',
        task: task,
      })
      this.tasks.tasks.splice(this.tasks.tasks.indexOf(task), 1)
      this.$emit('change', this.tasks)
    },
    onTitleInput(value) {
      this.$store.dispatch('addToChangesStack', {
        listId: this.tasks.id,
        mode: 'change taskList title',
        oldTitle: this.tasks.title,
        newTitle: value,
      })
      this.tasks.title = value
      this.$emit('change', this.tasks)
    },
  },
}
</script>

<style></style>
