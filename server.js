require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
});

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if(err) {
        console.error('Erro de conexão com o DB',err);
        return;
    }
    console.log('Conectado ao banco')
});

app.get('/tags', (req, res) => {
  db.query('SELECT * FROM tagtable', (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(results);
    }
  });
});

app.get('/posts', (req, res) => {
    db.query('SELECT * FROM postagenscontent', (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.json(results);
      }
    });
  });

  app.get('/posts/:postId', (req, res) => {
    const postId = req.params.postId;

    db.query('SELECT * FROM postagenscontent WHERE id = ?', [postId], (err, results) => {
        if (err) {
          res.status(500).json({ error: err });
        } else if(results.length === 0){
          res.status(404).json({message: 'Postagem não foi encontrada.'});
        } else {
          res.json(results);
        }
      });
  });
  
  app.get('/linkimg/:postId', (req, res) => {
    const postId = req.params.postId;

    db.query('SELECT * FROM imagens_link WHERE post_id = ?', [postId], (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
      } else if(results.length === 0){
        res.status(404).json({message: 'Imagens não foram encontradas.'});
      } else {
        res.json(results);
      }
    });
  });

  app.get('/posts/:postId/tags', (req, res) => {
    const postId = req.params.postId;

    db.query('SELECT tag_id FROM tag_post WHERE post_id = ?', [postId], (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
      } else if(results.length === 0){
        res.status(404).json({message: 'Tags não foram encontradas.'});
      } else {
        res.json(results);
      }
    });
  });

  app.get('/tags/:tagId/posts', (req, res) => {
    const tagId = req.params.tagId;

    db.query('SELECT post_id FROM tag_post WHERE tag_id = ?', [tagId], (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
      } else if(results.length === 0){
        res.status(404).json({message: 'Posts não foram encontrados.'});
      } else {
        res.json(results);
      }
    });
  });

  app.listen(PORT, () => {
    console.log(`Servidor funcionando em http://localhost:${PORT}`);
  });