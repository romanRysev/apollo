import gql from 'graphql-tag'
export const listQuery = gql`
  query {
    lists @client {
      id
      title
      tasks {
        id
        text
        done
      }
    }
  }
`
export const changeListMutation = gql`
  mutation ($list: List!) {
    changeList(list: $list) @client
  }
`

export const addListMutation = gql`
  mutation ($list: List!) {
    addList(list: $list) @client {
      id
      title
      tasks {
        id
        text
        done
      }
    }
  }
`

export const deleteListMutation = gql`
  mutation ($id: ID!) {
    deleteList(id: $id) @client
  }
`
