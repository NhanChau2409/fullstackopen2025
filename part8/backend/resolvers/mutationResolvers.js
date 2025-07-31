const Book = require("../models/Book");
const Author = require("../models/Author");
const User = require("../models/User");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const { initialAuthors } = require("../data/seedData");
const config = require("../config");

const mutationResolvers = {
  addBook: async (_root, args) => {
    try {
      // Find or create author
      let authorId = await Author.findOne({ name: args.author }).select("_id");
      
      if (!authorId) {
        const newAuthor = new Author({
          name: args.author,
        });
        const savedAuthor = await newAuthor.save();
        authorId = savedAuthor._id.valueOf();
      }
      
      // Create and save the new book
      const newBook = new Book({
        ...args,
        author: authorId.valueOf(),
      });
      
      await newBook.save();
      
      // Return the book with populated author
      const addedBook = await Book.findOne({ title: args.title }).populate("author");
      return addedBook;
    } catch (error) {
      console.error("Error adding book:", error);
      throw new GraphQLError("Failed to save book", {
        extensions: {
          code: "BAD_USER_INPUT",
          invalidArgs: JSON.stringify(args),
          error: error.message,
        },
      });
    }
  },
  
  editAuthor: async (_root, args) => {
    try {
      const authorIndex = initialAuthors.findIndex(
        (author) => author.name === args.name
      );
      
      if (authorIndex >= 0) {
        initialAuthors[authorIndex].born = args.setBornTo;
        return initialAuthors[authorIndex];
      }
      
      return null;
    } catch (error) {
      console.error("Error editing author:", error);
      throw new GraphQLError("Failed to edit author", {
        extensions: {
          code: "BAD_USER_INPUT",
          invalidArgs: args,
        },
      });
    }
  },
  
  createUser: async (_root, args) => {
    try {
      const newUser = new User({
        username: args.username,
        favoriteGenres: [],
      });
      
      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new GraphQLError("Failed to create user", {
        extensions: {
          code: "BAD_USER_INPUT",
          invalidArgs: args.username,
          error: error.message,
        },
      });
    }
  },
  
  login: async (_root, args) => {
    try {
      const user = await User.findOne({ username: args.username });
      
      if (!user) {
        throw new GraphQLError("Invalid credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      
      const userForToken = {
        username: user.username,
        id: user._id,
      };
      
      const token = jwt.sign(userForToken, config.security.jwtSecret);
      
      return {
        value: token,
      };
    } catch (error) {
      console.error("Error during login:", error);
      throw new GraphQLError("Login failed", {
        extensions: {
          code: "BAD_USER_INPUT",
        },
      });
    }
  },
};

module.exports = mutationResolvers; 