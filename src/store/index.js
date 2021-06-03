import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: { changesStack: [], currentStep: null },
  mutations: {
    addToChangesStack(state, item) {
      state.changesStack.push(item);
      state.currentStep = state.changesStack.length - 1;
      console.log(state.changesStack);
    },
  },
  actions: {},
  getters: {
    getChangesStack(state) {
      return state.changesStack;
    },
    getCurrentStep(state) {
      return state.currentStep;
    },
  },
  modules: {},
});
