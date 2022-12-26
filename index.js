require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;
const urls = [];

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  const { url: originalUrl } = req.body;
  let url = new URL(originalUrl);

  dns.lookup(url.hostname, (err, address, family) => {
    if (err) {
      res.json({ error: 'invalid url' });
    } else {
      if (!urls.some((item) => item === originalUrl)) {
        urls.push(originalUrl);
      }
      res.json({
        original_url: originalUrl,
        short_url: urls.indexOf(originalUrl),
      });
    }
  });
});

app.get('/api/shorturl/:id', function(req, res) {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id) || id < 0) {
    res.json({ error: 'Wrong format' });
  } else if (id >= urls.length) {
    res.json({ error: 'No short URL found for the given input' });
  } else {
    res.redirect(urls[id]);
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
