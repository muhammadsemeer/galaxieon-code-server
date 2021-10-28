import { config } from "dotenv";

config();

export const dbConfig = {
  database: process.env.DB_NAME as string,
  host: process.env.DB_HOST as string,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
};
