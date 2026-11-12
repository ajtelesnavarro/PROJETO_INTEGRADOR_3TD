import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "db_lumora",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "-03:00"
});

export async function checkDatabaseConnection() {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    return rows[0]?.ok === 1;
  } catch (erro) {
    console.error("Erro ao conectar no MySQL:", erro.message);
    return false;
  }
}
