import { Sequelize } from "sequelize";
import { dbConfig } from "../constants/db";

const db = new Sequelize({...dbConfig, dialect: "mariadb"});

export default db;
