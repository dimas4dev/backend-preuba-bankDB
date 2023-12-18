const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
app.use(cors());
app.use(express.json());

let db;
open({
  filename: 'dbBankShop.db',
  driver: sqlite3.Database
}).then(async (database) => {
  db = database;

  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      direccion TEXT,
      pass TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      categoria_id INTEGER NOT NULL,
      precio DECIMAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT
    );
    -- Insertar usuarios
INSERT INTO usuarios (nombre, email, direccion, pass) VALUES ('Juan Pérez', 'juan.perez@example.com', 'Calle Falsa 123', 'password123');
INSERT INTO usuarios (nombre, email, direccion, pass) VALUES ('Ana Gómez', 'ana.gomez@example.com', 'Avenida Siempre Viva 456', 'password456');
INSERT INTO usuarios (nombre, email, direccion, pass) VALUES ('Carlos Ruiz', 'carlos.ruiz@example.com', 'Plaza Central 789', 'password789');
INSERT INTO usuarios (nombre, email, direccion, pass) VALUES ('Laura Martínez', 'laura.martinez@example.com', 'Barrio El Sol 101', 'password101');
INSERT INTO usuarios (nombre, email, direccion, pass) VALUES ('Mario Bros', 'mario.bros@example.com', 'Calle Koopa 202', 'password202');

-- Insertar categorías
INSERT INTO categorias (nombre, descripcion) VALUES ('Electrónica', 'Dispositivos y accesorios electrónicos');
INSERT INTO categorias (nombre, descripcion) VALUES ('Libros', 'Libros de diversos géneros y autores');
INSERT INTO categorias (nombre, descripcion) VALUES ('Ropa', 'Ropa para hombres, mujeres y niños');

-- Insertar productos
INSERT INTO productos (nombre, descripcion, precio, categoria_id) VALUES ('Smartphone XYZ', 'Smartphone de última generación con 128GB de almacenamiento', 799.99, 1);
INSERT INTO productos (nombre, descripcion, precio, categoria_id) VALUES ('Laptop ABC', 'Laptop potente para trabajo y juegos', 1200.50, 1);
INSERT INTO productos (nombre, descripcion, precio, categoria_id) VALUES ('El señor de los Anillos', 'Trilogía completa en edición de lujo', 59.99, 2);
INSERT INTO productos (nombre, descripcion, precio, categoria_id) VALUES ('Jeans azules', 'Jeans cómodos y duraderos para el día a día', 39.99, 3);
INSERT INTO productos (nombre, descripcion, precio, categoria_id) VALUES ('Camiseta algodón', 'Camisetas de algodón en varios colores', 15.99, 3);

  `);

  app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
  });
});


app.post('/usuarios', async (req, res) => {
    const { nombre, email, direccion, pass } = req.body;
    try {
      const result = await db.run   (`INSERT INTO usuarios (nombre, email, direccion, pass) VALUES (?, ?, ?, ?)`, [nombre, email, direccion, pass]);
      res.status(201).json({ id: result.lastID });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

  app.get('/usuarios', async (req, res) => {
    try {
      const usuarios = await db.all('SELECT * FROM usuarios');
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  
  app.get('/usuarios/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await db.get('SELECT * FROM usuarios WHERE id = ?', [id]);
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).send('Usuario no encontrado');
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, email, direccion, pass } = req.body;
    try {
      const result = await db.run(`UPDATE usuarios SET nombre = ?, email = ?, direccion = ?, pass = ? WHERE id = ?`, [nombre, email, direccion, pass, id]);
      if (result.changes > 0) {
        res.status(200).send('Usuario actualizado con éxito');
      } else {
        res.status(404).send('Usuario no encontrado');
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  
  app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.run('DELETE FROM usuarios WHERE id = ?', [id]);
      if (result.changes > 0) {
        res.status(200).send('Usuario eliminado con éxito');
      } else {
        res.status(404).send('Usuario no encontrado');
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/productos', async (req, res) => {
    const { nombre, descripcion, precio, categoria_id } = req.body;
    try {
      const result = await db.run(`INSERT INTO productos (nombre, descripcion, precio, categoria_id) VALUES (?, ?, ?, ?)`, [nombre, descripcion, precio, categoria_id]);
      res.status(201).json({ id: result.lastID });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/productos', async (req, res) => {
    try {
      const productos = await db.all('SELECT * FROM productos');
      res.status(200).json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/productos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await db.get('SELECT * FROM productos WHERE id = ?', [id]);
      if (producto) {
        res.status(200).json(producto);
      } else {
        res.status(404).send('Producto no encontrado');
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/productos/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria_id } = req.body;
    try {
      const result = await db.run(`UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ? WHERE id = ?`, [nombre, descripcion, precio, categoria_id, id]);
      if (result.changes > 0) {
        res.status(200).send('Producto actualizado con éxito');
      } else {
        res.status(404).send('Producto no encontrado');
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete('/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.run('DELETE FROM productos WHERE id = ?', [id]);
    if (result.changes > 0) {
      res.status(200).send('Producto eliminado con éxito');
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  