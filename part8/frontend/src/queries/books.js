import { gql } from "@apollo/client";

export const ALL_BOOKS = gql`
  query {
    allBooks {
      id
      title
      published
      author {
        name
      }
      genres
    }
  }
`;

export const ALL_BOOKS_BY_GENRE = gql`
  query allBooksByGenre($genre: String!) {
    allBooks(genre: $genre) {
      id
      title
      published
      author {
        name
      }
      genres
    }
  }
`;

export const ADD_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      id
      title
      published
      author {
        name
      }
      genres
    }
  }
`;
