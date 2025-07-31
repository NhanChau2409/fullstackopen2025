import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($username: String!, $favoriteGenre: String!) {
    createUser(username: $username, favoriteGenre: $favoriteGenre) {
      id
      username
      favoriteGenre
    }
  }
`;

export const ME = gql`
  query {
    me {
      id
      username
      favoriteGenre
    }
  }
`; 