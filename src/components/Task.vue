<template>
  <section class="task">
    <v-icon v-if="!disabled" class="task__icon" @click="$emit('delete', task)"
      >mdi-close</v-icon
    >
    <v-checkbox
      v-model="task.done"
      :disabled="disabled"
      @input="$emit('change')"
    />
    <v-text-field
      v-model="task.text"
      :disabled="disabled"
      placeholder="текст задачи"
      :class="{ task__text_done: task.done }"
      @input="$emit('change')"
    ></v-text-field>
  </section>
</template>

<script>
export default {
  props: { task: Object, disabled: { type: Boolean, default: false } },
};
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
