<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-list
          ><v-list-item v-for="(item, i) in items" :key="i">
            <v-card class="d-flex ma-5" width="300" tile>
              <!--<v-list-item-icon>
                <v-icon>mdi-pen</v-icon>
              </v-list-item-icon>-->
              <v-list-item-content>
                <TaskList :taskList="item" />
              </v-list-item-content> </v-card></v-list-item
        ></v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TaskList from "@/components/TaskList.vue";
export default {
  components: {
    TaskList,
  },
  data: () => ({
    items: [
      {
        title: "title",
        tasks: [
          { id: 1, text: "text", done: false },
          { id: 2, text: "text2", done: false },
          { id: 3, text: "text3", done: false },
        ],
      },
      {
        title: "title2",
        tasks: [
          { id: 1, text: "text12", done: false },
          { id: 2, text: "text13", done: false },
          { id: 3, text: "text14", done: false },
        ],
      },
    ],
  }),
};
</script>
