const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const Thread = require('../models/Thread');
const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');

module.exports = {

    createUser(name) {
        return new Promise(function(resolve, reject) {
            User.create({name})
                .then(user => resolve(user))
                .catch(err => reject(err));
        })
    },

    createPost(creator, createdOn, content, ratings, parentThread) {
        return new Promise(function(resolve, reject) {
            Post.create({creator, createdOn, content, ratings, parentThread})
                .then(post => resolve(post))
                .catch(err => reject(err));
        })
    },

    createThread(name, parentSubCategoryId, creator, createdOn, content) {
        return new Promise(function(resolve, reject) {
            SubCategory.findOne({subCategoryId: parentSubCategoryId})
                .then((parentSubCategory) => {
                    let post = new Post({creator, createdOn: Date.now(), content});
                    let thread = new Thread({name, parentSubCategory, creator});
                    post.parentThread = thread;
                    thread.posts.push(post);
                    thread.createdOn = post.createdOn;
                    thread.lastPost = post;

                    parentSubCategory.postCount += 1;
                    parentSubCategory.lastPost = post;
                    parentSubCategory.ancestors.forEach((ancestor) => {
                        ancestor.postCount += 1;
                        ancestor.lastPost = post;
                    })
                    
                    Promise.all([post.save(), thread.save()])
                        .then(() => resolve(thread, post))
                        .catch((err) => reject(err));
                        })
                        .catch(err => reject(err));

            
        })
    },

    createSubCategory(name, description, parentCategoryId, parentSubCategoryId) {
        return new Promise(function(resolve, reject) {
            if (parentSubCategoryId) {
                SubCategory.findOne({subCategoryId: parentSubCategoryId})
                    .then((parentSubCategory) => {
                        const ancestors = [];
                        // the first ancestor of the child is the parent
                        ancestors.push(parentSubCategory);
                        // push all the ancestors of the parent onto the child
                        parentSubCategory.ancestors.forEach((el) => {
                            ancestors.push(el);
                        });
                        // save the child
                        SubCategory.create({name, description, ancestors})
                            .then(subcategory => {
                                // push the child to the subs of the parent
                                parentSubCategory.addSubCategory(subcategory)
                                    .then((updatedParent) => resolve(subcategory, updatedParent))
                                    .catch(err => reject(err));
                            })
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            } else {
                Category.findOneAndUpdate({categoryId: parentCategoryId}, {$push: {subCategories: subcategory}})
                    .then((parentCategory) => {
                        // save the child
                        SubCategory.create({name, description, ancestors})
                            .then(subcategory => {
                                // add the child to the parent
                                parentCategory.addSubCategory(subcategory)
                                    .then((updatedParent) => resolve(subcategory, updatedParent))
                                    .catch(err => reject(err));
                            })
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
                
            }

            
        })
    },

    createCategory(name) {
        return new Promise(function(resolve, reject) {
            Category.create({name})
                .then(category => resolve(category))
                .catch(err => reject(err));
        })
    }

}