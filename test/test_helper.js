const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

before((done) => {
  mongoose.connect('mongodb://localhost/forum_test', {
    /* other options */
  });
  mongoose.connection
    .once('open', () => { done(); })
    .on('error', (error) => { 
      console.warn('Warning', error);
    });
});

beforeEach((done) => {
  const { users, counters, posts, threads, subcategories, categories } = mongoose.connection.collections;
  
  users.drop(() => {
    posts.drop(() => {
      threads.drop(() => {
        subcategories.drop(() => {
          categories.drop(() => {
            counters.drop(() => {
              done();
            });
          });
        });
      });
    });
  });
});
