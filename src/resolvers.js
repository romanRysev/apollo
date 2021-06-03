import gql from "graphql-tag";
import shortid from "shortid";
import { listQuery } from "./queries";

export const typeDefs = gql`
  type List {
    id: ID!
    title: String
    tasks: [Task]
  }
  type Task {
    id: ID!
    text: String
    done: Boolean
  }
  type Mutation {
    changeList(list: List!): Boolean
    deleteList(id: ID!): Boolean
    addList(title: String!, tasks: [Task]): Item
  }
`;

export const resolvers = {
  Mutation: {
    changeList: (_, { list }, { cache }) => {
      const data = cache.readQuery({ query: listQuery });
      const currentItem = data.lists.find((item) => item.id === list.id);
      data.lists.splice(data.lists.indexOf(currentItem), 1, list);
      cache.writeQuery({ query: listQuery, data });
      localStorage.setItem("lists", JSON.stringify(data.lists));
      return "done!";
    },

    addList: (_, { list }, { cache }) => {
      const data = cache.readQuery({ query: listQuery });
      const newItem = {
        __typename: "List",
        id: shortid.generate(),
        title: list.title,
        tasks: list.tasks,
      };
      data.lists.push(newItem);
      cache.writeQuery({ query: listQuery, data });
      localStorage.setItem("lists", JSON.stringify(data.lists));
      return newItem;
    },

    deleteList: (_, { id }, { cache }) => {
      const data = cache.readQuery({ query: listQuery });
      const currentItem = data.lists.find((item) => item.id === id);
      data.lists.splice(data.lists.indexOf(currentItem), 1);
      cache.writeQuery({ query: listQuery, data });
      localStorage.setItem("lists", JSON.stringify(data.lists));
      return true;
    },
  },
};
