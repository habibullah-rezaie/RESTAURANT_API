const database = require("./db");

/**
 * server: An http server
 */
module.exports = async (server) => {
  try {
    console.log("Success Synchronizing database.");
  } catch (error) {
    console.error(error);
  }
};
