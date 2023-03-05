import app from "./app.js";
import { sequelize } from "./database/database.js";
async function main() {
  try {
    await sequelize.sync({ force: false });
    console.log("Connection has been established successfully.");
    app.listen(4000);
    console.log("Server running port 4000");
  } catch (error) {
    console.log("Unable to connect to the database", error);
  }
}

main();
