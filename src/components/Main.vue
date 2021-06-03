<template>
  <section>
    <v-container>
      <v-row class="justify-center">
        <v-col lg="9">
          <v-card
            v-for="(item, i) in lists"
            :key="i"
            class="card"
            @click="onCardClick(item)"
          >
            <TaskList :taskList="item" :short="true" :disabled="true" />
            <v-card-actions
              ><v-btn @click.stop="onDelete(item.id)"
                >Удалить</v-btn
              ></v-card-actions
            >
          </v-card>

          <v-card class="card" @click="onNew">
            <v-icon>mdi-plus</v-icon>
            <p>Добавить новый список</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog
      :value="isModalOpen"
      scrollable
      width="60%"
      @click:outside="isModalOpen = false"
      ><v-card class="card card_modal"
        ><v-card-title>{{ modalTitle }}</v-card-title
        ><v-card-text><TaskList :taskList="modalContent" /></v-card-text
        ><v-card-actions>
          <v-row>
            <v-col>
              <v-tooltip top open-delay="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="button" v-bind="attrs" v-on="on" @click="undo"
                    ><v-icon>mdi-undo</v-icon></v-btn
                  >
                </template>
                <span>Отменить последнее действие</span></v-tooltip
              >
              <v-tooltip top open-delay="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="button" v-bind="attrs" v-on="on"
                    ><v-icon>mdi-redo</v-icon></v-btn
                  >
                </template>
                <span>Повторить последнее действие</span></v-tooltip
              >
            </v-col>
            <v-col>
              <v-btn class="button" color="primary" @click="onSave"
                >Сохранить</v-btn
              ><v-btn class="button" color="error"
                >Закрыть без сохранения</v-btn
              >
            </v-col></v-row
          ></v-card-actions
        ></v-card
      ></v-dialog
    >
  </section>
</template>

<script>
import TaskList from "@/components/TaskList.vue";
import {
  listQuery,
  changeListMutation,
  addListMutation,
  deleteListMutation,
} from "@/queries.js";
export default {
  components: {
    TaskList,
  },
  data: () => ({
    isModalOpen: false,
    modalContent: {},
    modalTitle: "",
    mode: "",
  }),
  apollo: {
    lists: {
      query: listQuery,
    },
  },
  methods: {
    onCardClick(card) {
      this.modalTitle = "Изменение списка";
      this.modalContent = JSON.parse(JSON.stringify(card));
      this.isModalOpen = true;
    },
    onDelete(id) {
      console.log("delete");
      console.log(id);
      this.$apollo.mutate({
        mutation: deleteListMutation,
        variables: { id },
      });
    },
    onSave() {
      console.log(this.modalContent);
      if (this.mode !== "new") {
        this.$apollo.mutate({
          mutation: changeListMutation,
          variables: { list: this.modalContent },
        });
      } else {
        this.$apollo.mutate({
          mutation: addListMutation,
          variables: { list: this.modalContent },
        });
      }
      console.log(this.lists);
      this.isModalOpen = false;
    },
    onNew() {
      this.modalContent = { title: "", tasks: [] };
      this.modalTitle = "Новый список";
      this.mode = "new";
      this.isModalOpen = true;
    },
    undo() {
      const changesStack = this.$store.getters.getChangesStack;
      const currentStep = this.$store.getters.getCurrentStep;
      if (currentStep >= 0) {
        switch (changesStack[changesStack.length - 1].mode) {
          case "new task":
            this.modalContent.tasks.pop();

            break;

          default:
            break;
        }
      }

      this.$apollo.mutate({
        mutation: changeListMutation,
        variables: { list: this.modalContent },
      });
    },
  },
};
</script>
<style scoped>
.card {
  margin: 20px;
  padding: 20px;
  min-width: 300px;
  cursor: pointer;
}
.card_modal {
  margin: 0;
  cursor: auto;
}
.button {
  margin: 5px;
}
</style>
