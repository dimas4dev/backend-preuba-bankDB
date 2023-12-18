const sqlite = require('sqlite3');

const pool = sqlite.createPool({
  host: 'localhost',
  user: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'tu_base_de_datos'
});

module.exports = pool.promise();
