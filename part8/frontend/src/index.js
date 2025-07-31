import React from "react";
import ReactDOM from "react-dom/client";
import LibraryApp from "./App";
import "./styles.css";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <LibraryApp />
  </ApolloProvider>
);
