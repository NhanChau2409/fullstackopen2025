const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const config = require("./config");
const typeDefinitions = require("./schema");
const queryResolvers = require("./resolvers/queryResolvers");
const mutationResolvers = require("./resolvers/mutationResolvers");
const createAuthContext = require("./middleware/authContext");
const { initializeDatabase, seedDatabase } = require("./database/connection");

const startGraphQLServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    // Seed initial data
    await seedDatabase();
    
    // Create Apollo Server instance
    const graphQLServer = new ApolloServer({
      typeDefs: typeDefinitions,
      resolvers: {
        Query: queryResolvers,
        Mutation: mutationResolvers,
      },
    });
    
    // Start the server
    const { url } = await startStandaloneServer(graphQLServer, {
      listen: { port: config.server.port },
      context: createAuthContext,
    });
    
    console.log(`🚀 GraphQL server ready at ${url}`);
    console.log(`📊 Server running on port ${config.server.port}`);
    
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down server gracefully...");
  process.exit(0);
});

// Start the server
startGraphQLServer(); 