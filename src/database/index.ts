import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "trading",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "rootpassword",
  {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3310", 10), // Cambié 200 por 10
    dialect: "mysql",
    logging: false, 
  }
);


export default sequelize;
