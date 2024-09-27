import mysql from "mysql2/promise";

const db = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    port: Number(process.env.DB_PORT) || 3306,
    database: "questapp",
    timezone: "Z",
});

export default db;
