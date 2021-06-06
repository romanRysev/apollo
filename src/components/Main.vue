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
    <Dialog
      v-if="isModalOpen"
      :modalContent="modalContent"
      :modalTitle="modalTitle"
      @save="onSave"
      @delete="onDelete(modalContent.id)"
      @close="isModalOpen = false"
    />
    <v-dialog
      :value="confirmDialog"
      @click:outside="confirmDialog = false"
      width="50%"
    >
      <v-card
        ><v-card-title>Удаление списка</v-card-title
        ><v-card-text>Вы уверены?</v-card-text
        ><v-card-actions
          ><v-btn @click="deleteList">Да</v-btn
          ><v-btn @click="confirmDialog = false">Отмена</v-btn></v-card-actions
        ></v-card
      >
    </v-dialog>
  </section>
</template>

<script>
import TaskList from '@/components/TaskList.vue'
import Dialog from '@/components/Dialog.vue'
import {
  listQuery,
  changeListMutation,
  addListMutation,
  deleteListMutation,
} from '@/queries.js'

export default {
  components: {
    TaskList,
    Dialog,
  },
  created() {
    if (this.$store.getters.getEditableList) {
      this.modalContent = this.$store.getters.getEditableList.content
      this.modalTitle = this.$store.getters.getEditableList.title
      this.isModalOpen = true
    }
  },
  data: () => ({
    isModalOpen: false,
    modalContent: {},
    modalTitle: '',
    mode: '',
    confirmDialog: false,
  }),
  apollo: {
    lists: {
      query: listQuery,
    },
  },
  methods: {
    onCardClick(card) {
      this.modalTitle = 'Изменение списка'
      this.modalContent = JSON.parse(JSON.stringify(card))
      this.isModalOpen = true
    },
    onDelete(id) {
      this.deletableListId = id
      this.confirmDialog = true
    },
    deleteList() {
      this.confirmDialog = false
      this.$apollo.mutate({
        mutation: deleteListMutation,
        variables: { id: this.deletableListId },
      })
    },
    onSave(modalContent) {
      console.log(modalContent)
      if (this.mode !== 'new') {
        this.$apollo.mutate({
          mutation: changeListMutation,
          variables: { list: modalContent },
        })
      } else {
        this.$apollo.mutate({
          mutation: addListMutation,
          variables: { list: modalContent },
        })
      }
      this.isModalOpen = false
    },
    onNew() {
      this.modalContent = { title: '', tasks: [] }
      this.modalTitle = 'Новый список'
      this.mode = 'new'
      this.isModalOpen = true
    },
  },
}
</script>
<style>
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
