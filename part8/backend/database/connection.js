const mongoose = require("mongoose");
const config = require("../config");

const initializeDatabase = async () => {
  try {
    await mongoose.connect(config.database.uri);
    console.log("✅ Database connection established successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    const Author = require("../models/Author");
    const Book = require("../models/Book");
    const { initialAuthors, initialBooks } = require("../data/seedData");
    
    // Clear existing data
    await Author.deleteMany({});
    await Book.deleteMany({});
    console.log("🗑️  Cleared existing data");
    
    // Insert initial authors
    const savedAuthors = await Author.insertMany(initialAuthors);
    console.log("📚 Seeded initial author data");
    
    // Create a map of author names to their IDs
    const authorMap = new Map();
    savedAuthors.forEach(author => {
      authorMap.set(author.name, author._id);
    });
    
    // Insert initial books with proper author references
    const booksWithAuthorIds = initialBooks.map(book => ({
      ...book,
      author: authorMap.get(book.author)
    }));
    
    await Book.insertMany(booksWithAuthorIds);
    console.log("📖 Seeded initial book data");
    
  } catch (error) {
    console.error("❌ Database seeding failed:", error.message);
  }
};

module.exports = {
  initializeDatabase,
  seedDatabase,
}; 