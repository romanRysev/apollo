<template>
  <section class="task">
    <v-icon v-if="!disabled" class="task__icon" @click="$emit('delete', task)"
      >mdi-close</v-icon
    >
    <v-checkbox
      :disabled="disabled"
      :input-value="task.done"
      @change="onInput($event, 'done')"
    />
    <v-text-field
      :disabled="disabled"
      placeholder="текст задачи"
      :class="{ task__text_done: task.done }"
      :value="task.text"
      @input="onInput($event, 'text')"
    ></v-text-field>
  </section>
</template>

<script>
export default {
  props: { task: Object, disabled: { type: Boolean, default: false } },
  methods: {
    onInput(value, field) {
      console.log(value, this.task[field])
      this.$store.dispatch('addToChangesStack', {
        mode: 'change task field',
        task: this.task,
        newValue: value,
        oldValue: this.task[field],
        field: field,
      })
      this.task[field] = value
      this.$emit('change')
    },
  },
}
</script>

<style>
.task {
  display: flex;
  align-items: center;
}
.task__icon {
  margin-right: 10px;
  margin-bottom: 2px;
  cursor: pointer;
}
.task__text_done {
  text-decoration: line-through;
}
</style>
