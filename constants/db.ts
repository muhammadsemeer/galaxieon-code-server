import { config } from "dotenv";

config();

export const dbConfig = {
  database: "galaxieonCode",
  host: process.env.DB_HOST as string,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
};
