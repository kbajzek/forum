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
  let user, post, post2, post3, post4, thread, thread2, subCategory, subCategory2, subCategory3, subCategory4, category;

  beforeEach((done) => {
    category = new Category({ name: 'Category 1' });
    subCategory = new SubCategory({ name: 'SubCategory 1', description: 'first subcategory' });
    subCategory2 = new SubCategory({ name: 'SubCategory 2', description: 'second subcategory' });
    subCategory3 = new SubCategory({ name: 'SubCategory 3', description: 'third subcategory' });
    subCategory4 = new SubCategory({ name: 'SubCategory 4', description: 'fourth subcategory' });
    thread = new Thread({ name: 'Thread 1' });
    thread2 = new Thread({ name: 'Thread 2' });
    post = new Post({createdOn: Date.now(), content: '1'});
    post2 = new Post({createdOn: Date.now(), content: '2'});
    post3 = new Post({createdOn: Date.now(), content: '3'});
    post4 = new Post({createdOn: Date.now(), content: '4'});
    user = new User({name: 'user 1'});

    post.creator = user;
    post2.creator = user;
    post3.creator = user;
    post4.creator = user;

    category.subCategories.push(subCategory);
    category.subCategories.push(subCategory2);

    subCategory2.subCategories.push(subCategory3);
    subCategory3.ancestors.push(subCategory2);
    subCategory2.ancestors.forEach((el) => {
        subCategory3.ancestors.push(el);
    });

    subCategory3.subCategories.push(subCategory4);
    subCategory4.ancestors.push(subCategory3);
    subCategory3.ancestors.forEach((el) => {
        subCategory4.ancestors.push(el);
    });

 
    subCategory.threads.push(thread);
    thread.parentSubCategory = subCategory;

    subCategory.threads.push(thread2);
    thread2.parentSubCategory = subCategory;

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
    post3.parentThread = thread;
    thread2.parentSubCategory.postCount += 1;
    thread2.parentSubCategory.lastPost = post3;
    thread2.parentSubCategory.ancestors.forEach((ancestor) => {
        ancestor.postCount += 1;
        ancestor.lastPost = post3;
    })

    thread2.posts.push(post4);
    post4.parentThread = thread;
    thread2.lastPost = post4;
    thread2.parentSubCategory.postCount += 1;
    thread2.parentSubCategory.lastPost = post4;
    thread2.parentSubCategory.ancestors.forEach((ancestor) => {
        ancestor.postCount += 1;
        ancestor.lastPost = post4;
    })

    Promise.all([user.save(), category.save(), subCategory.save(), thread.save(), post.save()])
      .then(() => {
        Promise.all([subCategory2.save(), subCategory3.save(), subCategory4.save(), thread2.save(), post2.save(), post3.save(), post4.save()])  
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
    SubCategory.findOne({subCategoryId: 1})
        .populate({
            path: 'subCategories',
            select: 'name description lastPost postCount subCategoryId -_id',
            populate: {
                path: 'lastPost',
                select: 'createdOn creator parentThread -_id',
                populate: {
                    path: 'parentThread creator',
                    select: 'name -_id'
                }
            }
        })
        .populate({
            path: 'threads',
            select: 'name creator createdOn threadId totalViews lastPost posts -_id',
            populate: {
                path: 'creator lastPost',
                select: 'createdOn creator parentThread name -_id',
                populate: {
                    path: 'parentThread creator',
                    select: 'name -_id'
                }
            }
        })
        .lean()
        .then((subCat) => {
            const subCats = subCat.subCategories.map((subCategory) => {
                const { subCategoryId, postCount, lastPost, ...rest} = subCategory;
                const path = `/${subCategoryId}/${slugify(subCategory.name).toLowerCase()}`;

                let lastUpdated = 'none';
                let lastThreadName = 'none';
                let lastUser = 'none';

                if (subCategory.lastPost) {
                    lastUpdated = timeago.ago(new Date(subCategory.lastPost.createdOn));
                    lastThreadName = subCategory.lastPost.parentThread.name;
                    lastUser = subCategory.lastPost.creator.name;
                }
                
                const lastActiveThread = {
                    name: lastThreadName,
                    user: lastUser,
                    lastUpdated
                };

                return {
                    id: subCategory.subCategoryId,
                    path,
                    ...rest,
                    totalPosts: subCategory.postCount,
                    lastActiveThread
                }
            });

            const threads = subCat.threads.map((thread) => {
                const { name, creator, createdOn, threadId, totalViews, lastPost, ...rest} = thread;
                const path = `/thread/${threadId}/${slugify(name).toLowerCase()}`;

                let lastUpdated = 'none';
                let lastThreadName = 'none';
                let lastUser = 'none';

                if (thread.lastPost) {
                    lastUpdated = timeago.ago(new Date(thread.lastPost.createdOn));
                    lastThreadName = thread.lastPost.parentThread.name;
                    lastUser = thread.lastPost.creator.name;
                }
                
                const last_post = {
                    name: lastThreadName,
                    user: lastUser,
                    lastUpdated
                };

                const totalReplies = thread.posts.length;

                return {
                    id: thread.threadId,
                    path,
                    name,
                    creator: creator.name,
                    createdOn,
                    totalReplies,
                    totalViews,
                    lastPost: last_post
                }
            });

            const filledSubCategory = {
                id: subCat.subCategoryId,
                name: subCat.name,
                subCategories: subCats,
                threads
            }
            

            console.log(JSON.stringify(filledSubCategory, null, 2));
            done();
        });
            
  });
});
