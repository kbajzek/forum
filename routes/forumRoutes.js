const requireDir = require('require-dir');
const models = requireDir('../models');
const mongoose = require('mongoose');
const assert = require('assert');
const slugify = require('slugify');
const timeago = require('time-ago');
const User = require('../models/User');
const Post = require('../models/Post');
const Thread = require('../models/Thread');
const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');

module.exports = app => {

    const example_categories = [
        {
            id: 1,
            name: "Category 1",
            subCategories: [
                {
                    id: 1,
                    path: "/1/subcategory-1",
                    name: "Subcategory 1",
                    description: "Subcat Desc 1",
                    totalPosts: "8.3K",
                    lastActiveThread: {
                        name: "LastThread1",
                        user: "username1",
                        lastUpdated: "17 minutes ago"
                    }
                },
                {
                    id: 2,
                    path: "/2/subcategory-2",
                    name: "Subcategory 2",
                    description: "Subcat Desc 2",
                    totalPosts: "5.2K",
                    lastActiveThread: {
                        name: "LastThread2",
                        user: "username2",
                        lastUpdated: "23 minutes ago"
                    }
                },
                {
                    id: 3,
                    path: "/3/subcategory-3",
                    name: "Subcategory 3",
                    description: "Subcat Desc 3",
                    totalPosts: "9.1K",
                    lastActiveThread: {
                        name: "LastThread3",
                        user: "username3",
                        lastUpdated: "5 minutes ago"
                    }
                }
            ]
        },
        {
            id: 2,
            name: "Category 2",
            subCategories: [
                {
                    id: 4,
                    path: "/4/subcategory-4",
                    name: "Subcategory 4",
                    description: "Subcat Desc 4",
                    totalPosts: "8.3K",
                    lastActiveThread: {
                        name: "LastThread4",
                        user: "username4",
                        lastUpdated: "17 minutes ago"
                    }
                },
                {
                    id: 5,
                    path: "/5/subcategory-5",
                    name: "Subcategory 5",
                    description: "Subcat Desc 5",
                    totalPosts: "5.5K",
                    lastActiveThread: {
                        name: "LastThread5",
                        user: "username5",
                        lastUpdated: "53 minutes ago"
                    }
                },
                {
                    id: 6,
                    path: "/6/subcategory-6",
                    name: "Subcategory 6",
                    description: "Subcat Desc 6",
                    totalPosts: "9.1K",
                    lastActiveThread: {
                        name: "LastThread6",
                        user: "username6",
                        lastUpdated: "5 minutes ago"
                    }
                }
            ]
        }
    ];

    const example_subcategorypage = {
        name: "asdfasdfasdf",
        subcategories: [
            {
                id: 1,
                path: "/1/subcategory-1",
                name: "Subcategory 1",
                description: "Subcat Desc 1",
                totalPosts: "8.3K",
                lastActiveThread: {
                    name: "LastThread1",
                    user: "username1",
                    lastUpdated: "17 minutes ago"
                }
            },
            {
                id: 2,
                path: "/2/subcategory-2",
                name: "Subcategory 2",
                description: "Subcat Desc 2",
                totalPosts: "5.2K",
                lastActiveThread: {
                    name: "LastThread2",
                    user: "username2",
                    lastUpdated: "23 minutes ago"
                }
            }
        ],
        threads: [
            {
                id: 1,
                path: "/thread/1/thread-1",
                name: "thread 1",
                creator: "user1",
                createdOn: "june 12 3827",
                totalReplies: "8.3K",
                totalViews: "242",
                lastPost: {
                    name: "Last post 1",
                    user: "username1",
                    lastUpdated: "23 minutes ago"
                }
            },
            {
                id: 2,
                path: "/thread/2/thread-2",
                name: "thread 2",
                creator: "ddd",
                createdOn: "june 12 1812",
                totalReplies: "353",
                totalViews: "242",
                lastPost: {
                    name: "last ff 2",
                    user: "username2",
                    lastUpdated: "23 minutes ago"
                }

            }
        ]
    };

    app.get('/api/forums', (req, res) => {

        const Category = mongoose.model('Category');
        let category_ex;
        Category.find({})
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
        .lean()
        .then((categories) => {
            const filledCategories = categories.map((category) => {
                const filledSubCategories = category.subCategories.map((subCategory) => {
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
                const { _id, __v, categoryId, subCategories, ...rest} = category;
                return {
                    ...rest,
                    id: category.categoryId,
                    subCategories: filledSubCategories
                }
            });
            res.send(filledCategories);
        });
    })

    app.get('/api/forums/:id/:slug', (req, res) => {

        const SubCategory = mongoose.model('SubCategory');
        let subcategorypage;
        SubCategory.findOne({subCategoryId: req.params.id})
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
                

                res.send(filledSubCategory);
            });
    })
}