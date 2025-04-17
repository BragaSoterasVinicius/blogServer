const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blog_posts'
});

db.connect(err => {
    if(err) {
        console.error('Erro de conexão com o DB',err);
        return;
    }
    console.log('Conectado ao banco')
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

    db.query('SELECT * FROM postagenscontent WHERE post_id = ?', [postId], (err, results) => {
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

  app.listen(PORT, () => {
    console.log(`Servidor funcionando em http://localhost:${PORT}`);
  });