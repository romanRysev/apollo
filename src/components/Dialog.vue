<template>
  <section>
    <v-dialog
      :value="true"
      scrollable
      width="60%"
      @click:outside="$emit('close')"
      ><v-card class="card card_modal"
        ><v-card-title>{{ modalTitle }}</v-card-title
        ><v-card-text
          ><TaskList
            :taskList="content"
            @change="
              content = $event;
              writeLocalStorage($event);
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
              <v-btn class="button" color="error" @click="onDelete"
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
import TaskList from "@/components/TaskList.vue";
export default {
  components: { TaskList },
  props: {
    modalTitle: { type: String, default: "" },
    modalContent: { type: Object },
  },
  /*created() {
    console.log(this.modalContent);
    this.content = this.modalContent;
  },*/
  data() {
    return {
      content: this.modalContent,
      confirmDialog: false,
      confirmDialogTitle: "",
      confirmMode: "",
    };
  },
  beforeUpdate() {
    this.content = this.modalContent;
  },
  beforeDestroy() {
    this.$store.commit("clearStacks");
    localStorage.removeItem("editableList");
  },
  methods: {
    undo() {
      const changesStack = this.$store.getters.getChangesStack;
      if (changesStack.length > 0) {
        switch (changesStack[changesStack.length - 1].mode) {
          case "new task":
            console.log(this.content);
            this.content.tasks.pop();
            this.$store.commit("moveToRedoStack");

            break;
          case "delete task":
            this.content.tasks.push(changesStack[changesStack.length - 1].task);
            this.$store.commit("moveToRedoStack");
            break;

          default:
            break;
        }
      }

      /*this.$apollo.mutate({
        mutation: changeListMutation,
        variables: { list: this.content },
      });*/
      this.writeLocalStorage(this.content);
    },
    redo() {
      const redoStack = this.$store.getters.getRedoStack;
      if (redoStack.length > 0) {
        switch (redoStack[redoStack.length - 1].mode) {
          case "new task":
            this.content.tasks.push(redoStack[redoStack.length - 1].task);
            this.$store.commit("moveToChangesStack");

            break;
          case "delete task":
            this.content.tasks.pop();
            this.$store.commit("moveToChangesStack");
            break;

          default:
            break;
        }
      }
      this.writeLocalStorage(this.content);
    },
    onClose() {
      this.confirmDialogTitle = "Закрытие без сохранения";
      this.confirmDialog = true;
      this.confirmMode = "close";
    },
    onConfirm() {
      if (this.confirmMode === "close") {
        this.$emit("close");
      } else {
        this.$emit("delete");
        this.$emit("close");
      }
      this.confirmDialog = false;
    },
    onDelete() {
      this.confirmDialogTitle = "Удаление списка";
      this.confirmDialog = true;
      this.confirmMode = "delete";
    },
    writeLocalStorage(data) {
      localStorage.setItem(
        "editableList",
        JSON.stringify({ content: data, title: this.modalTitle })
      );
    },
  },
};
</script>

<style></style>
