import mysql from "mysql2/promise";

export const DATABASE_NAME = "app_db";

if (process.env.DB_NAME && process.env.DB_NAME.trim() !== DATABASE_NAME) {
  console.warn(
    `[database] DB_NAME=${process.env.DB_NAME.trim()} foi configurado, mas o sistema usa ${DATABASE_NAME}.`
  );
}

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function checkDatabaseConnection() {
  const [rows] = await pool.query("SELECT 1 AS ok");
  return rows[0]?.ok === 1;
}
