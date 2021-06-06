import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { changesStack: [], redoStack: [], editableList: null },
  mutations: {
    setChangesStack(state, value) {
      state.changesStack.push(value)
      console.log(state.changesStack)
    },

    moveToRedoStack(state) {
      state.redoStack.push(state.changesStack.pop())
      console.log(state.changesStack, state.redoStack)
    },
    moveToChangesStack(state) {
      state.changesStack.push(state.redoStack.pop())
      console.log(state.changesStack, state.redoStack)
    },
    clearStacks(state) {
      state.changesStack = []
      state.redoStack = []
    },
    setEditableList(state, value) {
      state.editableList = value
    },
  },
  actions: {
    addToChangesStack(state, item) {
      state.commit('setChangesStack', item)
    },
    initializeState(state) {
      if (localStorage.getItem('editableList')) {
        state.commit(
          'setEditableList',
          JSON.parse(localStorage.getItem('editableList'))
        )
      }
    },
  },
  getters: {
    getChangesStack(state) {
      return state.changesStack
    },
    getRedoStack(state) {
      return state.redoStack
    },
    getCurrentStep(state) {
      return state.currentStep
    },
    getEditableList(state) {
      return state.editableList
    },
  },
  modules: {},
})
