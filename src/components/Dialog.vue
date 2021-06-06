<template>
  <section>
    <v-dialog
      :value="true"
      scrollable
      :width="window.width > 600 ? '60%' : '100%'"
      @click:outside="$emit('close')"
      ><v-card class="card card_modal"
        ><v-card-title>{{ modalTitle }}</v-card-title
        ><v-card-text
          ><TaskList
            :taskList="content"
            @change="
              content = $event
              writeLocalStorage($event)
            " /></v-card-text
        ><v-card-actions>
          <v-row>
            <v-col cols="3">
              <v-tooltip top open-delay="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="button"
                    v-bind="attrs"
                    v-on="on"
                    @click="undo"
                    :disabled="$store.getters.getChangesStack.length === 0"
                    ><v-icon>mdi-undo</v-icon></v-btn
                  >
                </template>
                <span>Отменить последнее действие</span></v-tooltip
              >
              <v-tooltip top open-delay="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="button"
                    v-bind="attrs"
                    v-on="on"
                    @click="redo"
                    :disabled="$store.getters.getRedoStack.length === 0"
                    ><v-icon>mdi-redo</v-icon></v-btn
                  >
                </template>
                <span>Повторить отмененное действие</span></v-tooltip
              >
            </v-col>
            <v-col>
              <v-btn
                class="button"
                color="primary"
                @click="$emit('save', content)"
                >Сохранить</v-btn
              ><v-btn class="button" color="error" @click="onClose"
                >Закрыть без сохранения</v-btn
              >
              <v-btn
                v-if="mode == 'edit'"
                class="button"
                color="error"
                @click="onDelete"
                >Удалить список!</v-btn
              >
            </v-col></v-row
          ></v-card-actions
        ></v-card
      ></v-dialog
    >
    <v-dialog
      :value="confirmDialog"
      @click:outside="confirmDialog = false"
      width="50%"
    >
      <v-card
        ><v-card-title>{{ confirmDialogTitle }}</v-card-title
        ><v-card-text>Вы уверены?</v-card-text
        ><v-card-actions
          ><v-btn @click="onConfirm">Да</v-btn
          ><v-btn @click="confirmDialog = false">Отмена</v-btn></v-card-actions
        ></v-card
      >
    </v-dialog>
  </section>
</template>

<script>
import TaskList from '@/components/TaskList.vue'
export default {
  components: { TaskList },
  props: {
    modalTitle: { type: String, default: '' },
    modalContent: { type: Object },
    mode: { type: String, default: '' },
  },
  data() {
    return {
      content: this.modalContent,
      confirmDialog: false,
      confirmDialogTitle: '',
      confirmMode: '',
      window: { width: 0 },
    }
  },
  beforeUpdate() {
    this.content = this.modalContent
  },
  beforeDestroy() {
    this.$store.commit('clearStacks')
    localStorage.removeItem('editableList')
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    undo() {
      const changesStack = this.$store.getters.getChangesStack
      if (changesStack.length > 0) {
        switch (changesStack[changesStack.length - 1].mode) {
          case 'new task':
            console.log(this.content)
            this.content.tasks.pop()
            this.$store.commit('moveToRedoStack')

            break
          case 'delete task':
            this.content.tasks.push(changesStack[changesStack.length - 1].task)
            this.$store.commit('moveToRedoStack')
            break

          case 'change taskList title':
            this.content.title = changesStack[changesStack.length - 1].oldTitle
            this.$store.commit('moveToRedoStack')
            break

          case 'change task field':
            this.content.tasks[
              this.content.tasks.findIndex(
                (item) =>
                  changesStack[changesStack.length - 1].task.id === item.id
              )
            ][changesStack[changesStack.length - 1].field] =
              changesStack[changesStack.length - 1].oldValue

            this.$store.commit('moveToRedoStack')
            break
          default:
            break
        }
      }
      this.writeLocalStorage(this.content)
    },
    redo() {
      const redoStack = this.$store.getters.getRedoStack
      if (redoStack.length > 0) {
        switch (redoStack[redoStack.length - 1].mode) {
          case 'new task':
            this.content.tasks.push(redoStack[redoStack.length - 1].task)
            this.$store.commit('moveToChangesStack')

            break
          case 'delete task':
            this.content.tasks.pop()
            this.$store.commit('moveToChangesStack')
            break
          case 'change taskList title':
            this.content.title = redoStack[redoStack.length - 1].newTitle
            this.$store.commit('moveToChangesStack')
            break
          case 'change task field':
            this.content.tasks[
              this.content.tasks.findIndex(
                (item) => redoStack[redoStack.length - 1].task.id === item.id
              )
            ][redoStack[redoStack.length - 1].field] =
              redoStack[redoStack.length - 1].newValue

            this.$store.commit('moveToChangesStack')
            break
          default:
            break
        }
      }
      this.writeLocalStorage(this.content)
    },
    onClose() {
      this.confirmDialogTitle = 'Закрытие без сохранения'
      this.confirmDialog = true
      this.confirmMode = 'close'
    },
    onConfirm() {
      if (this.confirmMode === 'close') {
        this.$emit('close')
      } else {
        this.$emit('delete')
        this.$emit('close')
      }
      this.confirmDialog = false
    },
    onDelete() {
      this.confirmDialogTitle = 'Удаление списка'
      this.confirmDialog = true
      this.confirmMode = 'delete'
    },
    writeLocalStorage(data) {
      localStorage.setItem(
        'editableList',
        JSON.stringify({ content: data, title: this.modalTitle })
      )
    },
    handleResize() {
      this.window.width = window.innerWidth
    },
  },
}
</script>

<style></style>
