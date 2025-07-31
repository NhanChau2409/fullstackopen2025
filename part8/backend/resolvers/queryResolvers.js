const Book = require("../models/Book");
const Author = require("../models/Author");
const { GraphQLError } = require("graphql");

const queryResolvers = {
  dummy: () => 0,
  
  authorCount: async () => {
    try {
      return await Author.countDocuments();
    } catch (error) {
      console.error("Error counting authors:", error);
      throw new GraphQLError("Failed to count authors", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },
  
  bookCount: async () => {
    try {
      return await Book.countDocuments();
    } catch (error) {
      console.error("Error counting books:", error);
      throw new GraphQLError("Failed to count books", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },
  
  allBooks: async (_root, args) => {
    try {
      let query = {};
      
      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author });
        if (!author) {
          return [];
        }
        query = { author: author._id, genres: args.genre };
      } else if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (!author) {
          return [];
        }
        query = { author: author._id };
      } else if (args.genre) {
        query = { genres: args.genre };
      }
      
      return await Book.find(query).populate("author");
    } catch (error) {
      console.error("Error fetching books:", error);
      throw new GraphQLError("Failed to fetch books", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },
  
  allAuthors: async () => {
    try {
      const authors = await Author.find({});
      const authorsWithBookCount = await Promise.all(
        authors.map(async (author) => {
          const bookCount = await Book.countDocuments({ author: author._id });
          return {
            name: author.name,
            bookCount,
            born: author.born,
          };
        })
      );
      return authorsWithBookCount;
    } catch (error) {
      console.error("Error fetching authors:", error);
      throw new GraphQLError("Failed to fetch authors", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },
  
  findAuthor: async (_root, args) => {
    try {
      const author = await Author.findOne({ name: args.name });
      if (!author) {
        throw new GraphQLError("Author not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      
      const bookCount = await Book.countDocuments({ author: author._id });
      return {
        name: author.name,
        bookCount,
        born: author.born,
      };
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }
      console.error("Error finding author:", error);
      throw new GraphQLError("Failed to find author", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },
  
  me: (_root, _args, context) => {
    return context.currentUser;
  },
};

module.exports = queryResolvers; 