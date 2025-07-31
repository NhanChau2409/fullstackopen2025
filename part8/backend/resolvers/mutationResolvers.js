const Book = require("../models/Book");
const Author = require("../models/Author");
const User = require("../models/User");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const config = require("../config");

const mutationResolvers = {
  addBook: async (_root, args, context) => {
    if (!context.currentUser) {
      throw new GraphQLError("Not authenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    try {
      // Find or create author
      let author = await Author.findOne({ name: args.author });
      
      if (!author) {
        author = new Author({
          name: args.author,
        });
        await author.save();
      }
      
      // Create and save the new book
      const newBook = new Book({
        title: args.title,
        published: args.published,
        author: author._id,
        genres: args.genres,
      });
      
      const savedBook = await newBook.save();
      
      // Return the book with populated author
      const addedBook = await Book.findById(savedBook._id).populate("author");
      return addedBook;
    } catch (error) {
      console.error("Error adding book:", error);
      
      if (error.name === 'ValidationError') {
        throw new GraphQLError("Validation error", {
          extensions: {
            code: "BAD_USER_INPUT",
            error: error.message,
          },
        });
      }
      
      if (error.code === 11000) {
        throw new GraphQLError("Book title must be unique", {
          extensions: {
            code: "BAD_USER_INPUT",
            error: "Book with this title already exists",
          },
        });
      }
      
      throw new GraphQLError("Failed to save book", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error: error.message,
        },
      });
    }
  },
  
  editAuthor: async (_root, args, context) => {
    if (!context.currentUser) {
      throw new GraphQLError("Not authenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    try {
      const author = await Author.findOne({ name: args.name });
      
      if (!author) {
        throw new GraphQLError("Author not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      
      author.born = args.setBornTo;
      await author.save();
      
      const bookCount = await Book.countDocuments({ author: author._id });
      return {
        name: author.name,
        bookCount,
        born: author.born,
      };
    } catch (error) {
      console.error("Error editing author:", error);
      
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      if (error.name === 'ValidationError') {
        throw new GraphQLError("Validation error", {
          extensions: {
            code: "BAD_USER_INPUT",
            error: error.message,
          },
        });
      }
      
      throw new GraphQLError("Failed to edit author", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error: error.message,
        },
      });
    }
  },
  
  createUser: async (_root, args) => {
    try {
      const newUser = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });
      
      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      console.error("Error creating user:", error);
      
      if (error.name === 'ValidationError') {
        throw new GraphQLError("Validation error", {
          extensions: {
            code: "BAD_USER_INPUT",
            error: error.message,
          },
        });
      }
      
      if (error.code === 11000) {
        throw new GraphQLError("Username must be unique", {
          extensions: {
            code: "BAD_USER_INPUT",
            error: "Username already exists",
          },
        });
      }
      
      throw new GraphQLError("Failed to create user", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
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
      
      // For now, assume all users have the same hardcoded password
      const correctPassword = "secret";
      if (args.password !== correctPassword) {
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
      if (error instanceof GraphQLError) {
        throw error;
      }
      console.error("Error during login:", error);
      throw new GraphQLError("Login failed", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  },
};

module.exports = mutationResolvers; 