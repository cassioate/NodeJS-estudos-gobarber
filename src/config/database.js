require('dotenv').config();

module.exports = {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    // transformar as tabelas em user_groups quando voce criar uma com o nome de UserGroups
    underscored: true,
    // transformar também as colunas em user_groups quando voce criar uma com o nome de UserGroups
    underscoredAll: true
  }
}
