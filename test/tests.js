const mongoose = require('mongoose');
const assert = require('assert');
const slugify = require('slugify');
const timeago = require('time-ago');
const User = require('../models/User');
const Post = require('../models/Post');
const Thread = require('../models/Thread');
const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');

const forumController = require('../controllers/forumController');

describe('Tests', () => {
  let user, post, post2, post3, post4, thread, thread2, subCategory, subCategory2, subCategory3, subCategory4, subCategory5, category;

  beforeEach(async (done) => {
    category = await forumController.createCategory('Category 1');
    subCategory = await forumController.createSubCategory('SubCategory 1', 'first subcategory', category);
    subCategory2 = await forumController.createSubCategory('SubCategory 2', 'second subcategory', category);
    subCategory3 = await forumController.createSubCategory('SubCategory 3', 'third subcategory', null, subCategory2);
    subCategory4 = await forumController.createSubCategory('SubCategory 4', 'fourth subcategory', null, subCategory2);
    subCategory5 = await forumController.createSubCategory('SubCategory 5', 'fifth subcategory', null, subCategory);
    thread, post = await forumController.createThread('Thread 1', parentSubCategory, creator, createdOn, content);
    thread = new Thread({ name: 'Thread 1' });
    thread2 = new Thread({ name: 'Thread 2' });
    thread3 = new Thread({ name: 'Thread 3' });
    post = new Post({createdOn: Date.now(), content: '1' });
    post2 = new Post({createdOn: Date.now(), content: '2'});
    post3 = new Post({createdOn: Date.now(), content: '3'});
    post4 = new Post({createdOn: Date.now(), content: '4'});
    post5 = new Post({createdOn: Date.now(), content: '5'});
    user = new User({name: 'user 1'});

    const ratings = [
        {
            name: 'like'
        },
        {
            name: 'dislike'
        }
    ];

    


    post.creator = user;
    post2.creator = user;
    post3.creator = user;
    post4.creator = user;
    post5.creator = user;

    post.ratings = ratings;
    post2.ratings = ratings;
    post3.ratings = ratings;
    post4.ratings = ratings;
    post5.ratings = ratings;

    post.ratings[0].users.push(user);
    post2.ratings[0].users.push(user);
    post3.ratings[0].users.push(user);
    post4.ratings[0].users.push(user);
    post5.ratings[0].users.push(user);
    post.ratings[1].users.push(user);
    post2.ratings[1].users.push(user);
    post3.ratings[1].users.push(user);
    post4.ratings[1].users.push(user);
    post5.ratings[1].users.push(user);

 
    subCategory.threads.push(thread);
    thread.parentSubCategory = subCategory;

    subCategory.threads.push(thread2);
    thread2.parentSubCategory = subCategory;

    subCategory5.threads.push(thread3);
    thread3.parentSubCategory = subCategory5;


    thread.posts.push(post);
    thread.creator = post.creator;
    thread.createdOn = post.createdOn;
    thread.lastPost = post;
    post.parentThread = thread;
    thread.parentSubCategory.postCount += 1;
    thread.parentSubCategory.lastPost = post;
    thread.parentSubCategory.ancestors.forEach((ancestor) => {
        ancestor.postCount += 1;
        ancestor.lastPost = post;
    })

    thread.posts.push(post2);
    thread.lastPost = post2;
    post2.parentThread = thread;
    thread.parentSubCategory.postCount += 1;
    thread.parentSubCategory.lastPost = post2;
    thread.parentSubCategory.ancestors.forEach((ancestor) => {
        ancestor.postCount += 1;
        ancestor.lastPost = post2;
    })

    thread2.posts.push(post3);
    thread2.creator = post3.creator;
    thread2.createdOn = post3.createdOn;
    thread2.lastPost = post3;
    post3.parentThread = thread2;
    thread2.parentSubCategory.postCount += 1;
    thread2.parentSubCategory.lastPost = post3;
    thread2.parentSubCategory.ancestors.forEach((ancestor) => {
        ancestor.postCount += 1;
        ancestor.lastPost = post3;
    })

    thread2.posts.push(post4);
    post4.parentThread = thread2;
    thread2.lastPost = post4;
    thread2.parentSubCategory.postCount += 1;
    thread2.parentSubCategory.lastPost = post4;
    thread2.parentSubCategory.ancestors.forEach((ancestor) => {
        ancestor.postCount += 1;
        ancestor.lastPost = post4;
    })

    thread3.posts.push(post5);
    thread3.creator = post5.creator;
    thread3.createdOn = post5.createdOn;
    thread3.lastPost = post5;
    post5.parentThread = thread3;
    thread3.parentSubCategory.postCount += 1;
    thread3.parentSubCategory.lastPost = post5;
    thread3.parentSubCategory.ancestors.forEach((ancestor) => {
        ancestor.postCount += 1;
        ancestor.lastPost = post5;
    })

    Promise.all([user.save(), category.save(), subCategory.save(), thread.save(), post.save()])
      .then(() => {
        Promise.all([
                        subCategory2.save(), 
                        subCategory3.save(), 
                        subCategory4.save(), 
                        subCategory5.save(),
                        thread2.save(),
                        thread3.save(), 
                        post2.save(), 
                        post3.save(), 
                        post4.save(), 
                        post5.save()])  
          .then(() => done());
      });
  });

  it('saves a relation between a category and subCategory', (done) => {
    Category.findOne({ name: 'Category 1' })
      .populate('subCategories')
      .then((category) => {
        assert(category.subCategories[0].name === 'SubCategory 1');
        done();
      });
  });

  it('saves a full relation graph', (done) => {
    Category.findOne({ name: 'Category 1' })
      .populate({
        path: 'subCategories',
        populate: {
          path: 'threads',
          model: 'Thread',
          populate: {
            path: 'posts',
            model: 'Post'
          }
        }
      })
      .then((category) => {
        assert(category.name === 'Category 1');
        assert(category.subCategories[0].name === 'SubCategory 1');
        assert(category.subCategories[0].threads[0].name === 'Thread 1');
        assert(category.subCategories[0].threads[0].posts[0].content === '1');
        //console.log(JSON.stringify(category, null, 2));
        done();
      });
  });

  it('just checking', (done) => {
    done();
            
  });
});
