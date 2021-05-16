module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  port: '5432',
  username: 'postgres',
  password: 'kaka18',
  database: 'gobarberDB',
  define: {
    timestamps: true,
    // transformar as tabelas em user_groups quando voce criar uma com o nome de UserGroups
    underscored: true,
    // transformar também as colunas em user_groups quando voce criar uma com o nome de UserGroups
    underscoredAll: true
  }
}
