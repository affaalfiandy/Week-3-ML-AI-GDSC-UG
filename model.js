const tf = require('@tensorflow/tfjs-node');
const movies = require('./data/movielens100k_details.json');

function loadData() {
  const movie_arr = [];
  for (let i = 0; i < movies.length; i++) {
    movie_arr.push([movies[i]['movie_id']]);
  }
  return movie_arr;
}

// Buat fungsi untuk load data disini

const movie_arr = tf.tensor(loadData());
const movie_len = movies.length;

// Buat fungsi untuk memberi rekomendasi film
