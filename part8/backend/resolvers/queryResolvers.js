const Book = require("../models/Book");
const Author = require("../models/Author");
const { initialAuthors, initialBooks } = require("../data/seedData");

const queryResolvers = {
  dummy: () => 0,
  
  authorCount: () => initialAuthors.length,
  
  bookCount: () => initialBooks.length,
  
  allBooks: async (_root, args) => {
    try {
      let query = {};
      
      if (args.author && args.genre) {
        const authorId = await Author.findOne({ name: args.author }).select("_id");
        query = { author: authorId, genres: args.genre };
      } else if (args.author) {
        const authorId = await Author.findOne({ name: args.author }).select("_id");
        query = { author: authorId };
      } else if (args.genre) {
        query = { genres: args.genre };
      }
      
      return await Book.find(query).populate("author");
    } catch (error) {
      console.error("Error fetching books:", error);
      throw new Error("Failed to fetch books");
    }
  },
  
  allAuthors: async () => {
    try {
      const bookCounts = new Map();
      
      // Count books per author
      initialBooks.forEach((book) => {
        const currentCount = bookCounts.get(book.author) || 0;
        bookCounts.set(book.author, currentCount + 1);
      });
      
      // Map authors with their book counts
      return initialAuthors.map((author) => ({
        name: author.name,
        bookCount: bookCounts.get(author.name) || 0,
        born: author.born,
      }));
    } catch (error) {
      console.error("Error fetching authors:", error);
      throw new Error("Failed to fetch authors");
    }
  },
  
  findAuthor: (_root, args) => {
    return initialAuthors.find((author) => author.name === args.name);
  },
  
  me: (_root, _args, context) => {
    return context.currentUser;
  },
};

module.exports = queryResolvers; 