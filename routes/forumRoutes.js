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
            res.send(filledCategories);
        });
    })

    app.get('/api/forums/:id/:slug', (req, res) => {

        res.send(example_subcategorypage);
    })
}