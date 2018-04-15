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

    const example_thread = {
        name: "jjj",
        posts: [
            {
                id: 1,
                content: "hiiiiiiiiiiiiiiiiiiiiiii",
                ratings: [
                    {
                        ratingName: "Like",
                        users: [
                            {userName: "ssss"}
                        ]
                    },
                    {
                        ratingName: "Dislike",
                        users: [
                            {userName: "ssss"}
                        ]
                    }
                ],
                creator: {
                    name: "ssssss",
                    pictureURL: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/81/8117d1780455347891a44ccb80a45c6d693ebfae_full.jpg",
                    totalPosts: "235",
                    signature: "asdfasdf"
                }
            },
            {
                id: 2,
                content: "hiiiiiiiiiiiiiiiiiiiiiii",
                ratings: [
                    {
                        ratingName: "Like",
                        users: [
                            {userName: "ssss"}
                        ]
                    },
                    {
                        ratingName: "Dislike",
                        users: [
                            {userName: "ssss"}
                        ]
                    }
                ],
                creator: {
                    name: "ssssss",
                    pictureURL: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/81/8117d1780455347891a44ccb80a45c6d693ebfae_full.jpg",
                    totalPosts: "235",
                    signature: "asdfasdf"
                }
            }
        ]
    };

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
                        lastUpdated: "17 minutes ago",
                        path: "/thread/1/lastthread1"
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
                        lastUpdated: "23 minutes ago",
                        path: "/thread/2/lastthread2"
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
                        lastUpdated: "5 minutes ago",
                        path: "/thread/2/lastthread2"
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
                        lastUpdated: "17 minutes ago",
                        path: "/thread/2/lastthread2"
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
                        lastUpdated: "53 minutes ago",
                        path: "/thread/2/lastthread2"
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
                        lastUpdated: "5 minutes ago",
                        path: "/thread/2/lastthread2"
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
                    lastUpdated: "17 minutes ago",
                    path: "/thread/2/lastthread2"
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
                    lastUpdated: "23 minutes ago",
                    path: "/thread/2/lastthread2"
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
                    select: 'name threadId -_id'
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
                    let lastActiveThreadPath = 'none';

                    if (subCategory.lastPost) {
                        lastUpdated = subCategory.lastPost.createdOn;
                        lastThreadName = subCategory.lastPost.parentThread.name;
                        lastUser = subCategory.lastPost.creator.name;
                        lastActiveThreadPath = `/thread/${subCategory.lastPost.parentThread.threadId}/${slugify(lastThreadName).toLowerCase()}`;
                    }
                    
                    const lastActiveThread = {
                        name: lastThreadName,
                        user: lastUser,
                        lastUpdated,
                        path: lastActiveThreadPath
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
                        select: 'name threadId -_id'
                    }
                }
            })
            .populate({
                path: 'threads',
                select: 'name creator createdOn threadId totalViews lastPost posts',
                populate: {
                    path: 'creator lastPost',
                    select: 'createdOn creator parentThread name',
                    populate: {
                        path: 'parentThread creator',
                        select: 'name'
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
                    let lastActiveThreadPath = 'none';

                    if (subCategory.lastPost) {
                        lastUpdated = subCategory.lastPost.createdOn;
                        lastThreadName = subCategory.lastPost.parentThread.name;
                        lastUser = subCategory.lastPost.creator.name;
                        lastActiveThreadPath = `/thread/${subCategory.lastPost.parentThread.threadId}/${slugify(lastThreadName).toLowerCase()}`;
                    }
                    
                    const lastActiveThread = {
                        name: lastThreadName,
                        user: lastUser,
                        lastUpdated,
                        path: lastActiveThreadPath
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
                        lastUpdated = thread.lastPost.createdOn;
                        lastThreadName = thread.lastPost.parentThread.name;
                        lastUser = thread.lastPost.creator.name;
                    }
                    
                    const last_post = {
                        name: lastThreadName,
                        user: lastUser,
                        lastUpdated
                    };

                    const totalReplies = thread.posts.length - 1;

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

    app.get('/api/forums/thread/:id/:slug', (req, res) => {

        const Thread = mongoose.model('Thread');
        let threadPage;
        Thread.findOne({threadId: req.params.id})
            .populate({
                path: 'posts',
                select: 'postId content ratings creator -_id',
                populate: {
                    path: 'creator ratings.users',
                    select: 'name -_id',
                }
            })
            .lean()
            .then((thread) => {
                const filledPosts = thread.posts.map((post) => {
                    const { content, postId, ratings, creator} = post;

                    const filledRatings = ratings.map((rating) => {
                        
                        const filledUsers = rating.users.map((user) => {
                            return {
                                userName: user.name
                            }
                        });

                        return {
                            ratingName: rating.name,
                            users: filledUsers
                        }
                    });

                    const filledCreator = {
                        name: creator.name,
                        pictureURL: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/81/8117d1780455347891a44ccb80a45c6d693ebfae_full.jpg",
                        totalPosts: "not implemented yet",
                        signature: "asdfasdf"
                    }

                    return {
                        id: postId,
                        content,
                        ratings: filledRatings,
                        creator: filledCreator
                    }
                });

                const filledThread = {
                    name: thread.name,
                    posts: filledPosts
                }
                

                res.send(filledThread);
            });
        
    })
}