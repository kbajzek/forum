const mongoose = require('mongoose');
const assert = require('assert');
const slugify = require('slugify');
const timeago = require('time-ago');
const User = require('../models/User');
const Post = require('../models/Post');
const Thread = require('../models/Thread');
const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');

describe('Tests', () => {
  let user, post, post2, post3, post4, thread, thread2, subCategory, subCategory2, subCategory3, category;

  beforeEach((done) => {
    category = new Category({ name: 'Category 1' });
    subCategory = new SubCategory({ name: 'SubCategory 1', description: 'first subcategory' });
    subCategory2 = new SubCategory({ name: 'SubCategory 2', description: 'second subcategory' });
    subCategory3 = new SubCategory({ name: 'SubCategory 3', description: 'third subcategory' });
    thread = new Thread({ name: 'Thread 1' });
    thread2 = new Thread({ name: 'Thread 2' });
    post = new Post({createdOn: Date.now(), content: '1'});
    post2 = new Post({createdOn: Date.now(), content: '2'});
    post3 = new Post({createdOn: Date.now(), content: '3'});
    post4 = new Post({createdOn: Date.now(), content: '4'});
    user = new User({name: 'user 1'});

    category.subCategories.push(subCategory);
    category.subCategories.push(subCategory2);
    category.subCategories.push(subCategory3);
    subCategory.threads.push(thread);
    subCategory.threads.push(thread2);
    thread.posts.push(post);
    thread.posts.push(post2);
    thread2.posts.push(post3);
    thread2.posts.push(post4);
    post.creator = user;

    Promise.all([user.save(), category.save(), subCategory.save(), thread.save(), post.save()])
      .then(() => {
        Promise.all([subCategory2.save(), subCategory3.save(), thread2.save(), post2.save(), post3.save(), post4.save()])  
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

  it('postCount works', (done) => {
    Category.findOne({ name: 'Category 1' })
      .populate('subCategories')
      .then((category) => {
        category.subCategories[0].getPostCount(function(err, total) {
          assert(total === 4);
        });
        done();
      });
  });

  it('just checking', (done) => {
    Category.find({})
      .populate({
        path: 'subCategories',
        populate: {
          path: 'threads',
          model: 'Thread',
          populate: {
            path: 'posts',
            model: 'Post',
            populate: {
              path: 'creator',
              model: 'User'
            }
          }
        }
      })
      .lean()
      .then((categories) => {
        const filledCategories = categories.map((category) => {
          const subCategories = category.subCategories.map((subCategory) => {
            const totalPosts = subCategory.threads.reduce((total, thread) => {
              return total + thread.posts.length;
            }, 0);
            const { _id, __v, subCategoryId, threads, ...rest} = subCategory;
            const path = `/${subCategoryId}/${slugify(subCategory.name)}`;
            let lastThread = subCategory.threads.sort((aa, bb) => {
              const aaa = aa.posts.sort((a, b) => {
                return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime() ;
              })[0];
              const bbb = bb.posts.sort((a, b) => {
                return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime() ;
              })[0];
              return new Date(bbb.createdOn).getTime() - new Date(aaa.createdOn).getTime() ;
            })[0];

            let lastPost, lastUpdated;

            if (lastThread) {
              lastPost = lastThread.posts.sort((a, b) => {
                return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
              })[0];
              if (lastPost) {
                lastUpdated = timeago.ago(new Date(lastPost.createdOn));
              } else {
                lastPost = {creator: {name: 'none'}};
                lastUpdated = 'none';
              }
            } else {
              lastThread = {name: 'none'};
              lastPost = {creator: {name: 'none'}};
              lastUpdated = 'none';
            };
            
            const lastActiveThread = {
              name: lastThread.name,
              user: lastPost.creator.name,
              lastUpdated 
            };

            return {
              ...rest,
              id: subCategory.subCategoryId,
              totalPosts,
              path,
              lastActiveThread
            }
          });
          const { _id, __v, categoryId, ...rest} = category;
          return {
            ...rest,
            id: category.categoryId,
            subCategories
          }
        });
        console.log(JSON.stringify(filledCategories, null, 2));
        done();
      });
  });
});
