const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const path = require('path');
const movies = require('./data/movielens100k_details.json');
const model = require('./model');

const app = express();

/* app.set('views', './views');
app.set('view engine', 'hbs'); */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Body parser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

/* app.engine(
  '.hbs',
  expressHbs({
    defaultLayout: 'layout',
    extname: '.hbs',
  })
); */

app.get('/', (req, res) => {
  res.render('index', {
    movies: movies.slice(0, 12),
    pg_start: 0,
    pg_end: 12,
    forUser: false,
    recommendations: [],
  });
});

app.get('/get-next', (req, res) => {
  let pg_start = Number(req.query.pg_end);
  let pg_end = Number(pg_start) + 12;
  res.render('index', {
    movies: movies.slice(pg_start, pg_end),
    pg_start: pg_start,
    pg_end: pg_end,
    forUser: false,
  });
});

app.get('/get-prev', (req, res) => {
  let pg_end = Number(req.query.pg_start);
  let pg_start = Number(pg_end) - 12;

  if (pg_start <= 0) {
    res.render('index', {
      movies: movies.slice(0, 12),
      pg_start: 0,
      pg_end: 12,
      forUser: false,
    });
  } else {
    res.render('index', {
      movies: movies.slice(pg_start, pg_end),
      pg_start: pg_start,
      pg_end: pg_end,
      forUser: false,
    });
  }
});

app.get('/recommend', (req, res) => {
  let userId = req.query.userId;
  if (Number(userId) > 53424 || Number(userId) < 0) {
    res.send('User Id cannot be greater than 53,424 or less than 0!');
  } else {
    recs = model.recommend(userId).then((recs) => {
      res.render('index', { recommendations: recs, forUser: true });
    });
  }
});

module.exports = app;
