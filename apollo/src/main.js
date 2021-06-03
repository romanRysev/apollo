import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueApollo from "vue-apollo";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import { typeDefs, resolvers } from "./resolvers";

Vue.config.productionTip = false;

Vue.use(VueApollo);
const cache = new InMemoryCache();
const apolloClient = new ApolloClient({ cache, typeDefs, resolvers });
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

cache.writeData({
  data: {
    lists: JSON.parse(localStorage.getItem("lists")),
  },
});

new Vue({
  store,
  vuetify,
  apolloProvider,
  render: (h) => h(App),
}).$mount("#app");
