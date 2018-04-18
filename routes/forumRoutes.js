const assert = require('assert');
const slugify = require('slugify');
const models  = require('../models');
const queries = require('../controllers/queries');
const sqlstring = require('sqlstring');
const controllers = require('../controllers/controllers');

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

        models.sequelize.query(queries.getCategoriesQuery(), { type: models.Sequelize.QueryTypes.SELECT})
            .then(result => {

                let convertedResult = [];
                let currentCatPosition = 0;

                result.forEach((row) => {

                    let lastUpdated = row.maxDate || 'none';
                    let lastThreadName = row.ThreadName || 'none';
                    let lastUser = row.UserName || 'none';
                    let lastActiveThreadPath = row.ThreadId ? `/thread/${row.ThreadId}/${slugify(row.ThreadName).toLowerCase()}` : 'none';

                    if (currentCatPosition !== row.categoryPosition) {
                        currentCatPosition = row.categoryPosition;

                        let subCategories = [];

                        if (row.subCategoryId) {
                            subCategories = [{
                                id: row.subCategoryId,
                                name: row.subCategoryName,
                                path: `/${row.subCategoryId}/${slugify(row.subCategoryName).toLowerCase()}`, 
                                description: row.description,
                                totalPosts: row.totalPosts || 0,
                                lastActiveThread: {
                                    name: lastThreadName,
                                    user: lastUser,
                                    lastUpdated: lastUpdated,
                                    path: lastActiveThreadPath
                                }
                            }]
                        }

                        convertedResult.push(
                            {
                                id: row.categoryId, 
                                name: row.categoryName, 
                                subCategories
                            }
                        );
                    } else {
                        //has to have at least 2 subcategories to get to here
                        convertedResult[convertedResult.length - 1].subCategories.push(
                            {
                                id: row.subCategoryId,
                                name: row.subCategoryName,
                                path: `/${row.subCategoryId}/${slugify(row.subCategoryName).toLowerCase()}`, 
                                description: row.description,
                                totalPosts: row.totalPosts || 0,
                                lastActiveThread: {
                                    name: lastThreadName,
                                    user: lastUser,
                                    lastUpdated: lastUpdated,
                                    path: lastActiveThreadPath
                                }

                            }
                        )
                    }
                });

                res.send(convertedResult);
            });
    })

    app.get('/api/forums/:id/:slug', async (req, res) => {

        
        try {
            let subcatid = Number(req.params.id);

            let result1 = await models.sequelize.query(queries.getSubCategoriesQuery(subcatid), { type: models.Sequelize.QueryTypes.SELECT});
            let result2 = await models.sequelize.query(queries.getThreadsQuery(subcatid), { type: models.Sequelize.QueryTypes.SELECT});
            let result3 = await models.sequelize.query(`SELECT name FROM forum_test.subcategories as s WHERE s.id =  ${subcatid}`, { type: models.Sequelize.QueryTypes.SELECT});
                
            let convertedResult = [];
            let convertedResult2 = [];

            result1.forEach((row) => {

                let lastUpdated = row.maxDate || 'none';
                let lastThreadName = row.ThreadName || 'none';
                let lastUser = row.UserName || 'none';
                let lastActiveThreadPath = row.ThreadId ? `/thread/${row.ThreadId}/${slugify(row.ThreadName).toLowerCase()}` : 'none';

                convertedResult.push(
                    {
                        id: row.subCategoryId,
                        name: row.subCategoryName,
                        path: `/${row.subCategoryId}/${slugify(row.subCategoryName).toLowerCase()}`, 
                        description: row.description,
                        totalPosts: row.totalPosts || 0,
                        lastActiveThread: {
                            name: lastThreadName,
                            user: lastUser,
                            lastUpdated: lastUpdated,
                            path: lastActiveThreadPath
                        }
                    }
                );
            });

            result2.forEach((row) => {
                convertedResult2.push(
                    {
                        id: row.ThreadId,
                        path: `/thread/${row.ThreadId}/${slugify(row.ThreadName).toLowerCase()}`,
                        name: row.ThreadName,
                        creator: row.creatorName,
                        createdOn: row.ThreadMade,
                        totalReplies: row.totalPosts - 1,
                        totalViews: 0,
                        lastPost: {
                            name: row.ThreadName,
                            user: row.userName,
                            lastUpdated: row.maxDate
                        }
                    }
                );
            });

            const finalResult = {
                id: subcatid,
                name: result3[0].name,
                subCategories: convertedResult,
                threads: convertedResult2
            }

            res.send(finalResult);
        } catch(err) {
            res.status(404).send(err);
        }

    })

    app.get('/api/forums/thread/:id/:slug', (req, res) => {

        let threadId = Number(req.params.id);
        models.sequelize.query(queries.getThreadQuery(threadId), { type: models.Sequelize.QueryTypes.SELECT})
            .then(result => {

                let convertedPosts = [];
                let currentPostPosition = 0;
                let currentRatingId = 0;

                result.forEach((row) => {

                    let rating;
                    //if rating is not null, build it. If it exists, it will always have a user
                    if (row.ratingName) {
                        rating = {
                            ratingName: row.ratingName,
                            users: [
                                {userName: row.ratingUserName}
                            ]
                        };
                    }

                    if(currentPostPosition !== row.postPosition) {
                        // add another post, may or may not have a rating
                        currentPostPosition = row.postPosition;
                        convertedPosts.push(
                            {
                                id: row.postId,
                                content: row.postContent,
                                ratings: [],
                                creator: {
                                    name: row.creatorName,
                                    pictureURL: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/81/8117d1780455347891a44ccb80a45c6d693ebfae_full.jpg",
                                    totalPosts: row.postCount,
                                    signature: "to be implemented"
                                }
                            }
                        );

                        if (rating) {
                            // add a new rating, reset current rating placeholder
                            currentRatingId = row.ratingId;
                            convertedPosts[convertedPosts.length - 1].ratings.push(rating);
                        }
                    } else {
                        //there has to be at least 1 rating to get to here, and user has to exist
                        if (currentRatingId !== row.ratingId) {
                            currentRatingId = row.ratingId;
                            // another rating type
                            convertedPosts[convertedPosts.length - 1].ratings.push(rating);
                        } else {
                            // same rating type, different user
                            const lastRating = convertedPosts[convertedPosts.length - 1].ratings.length - 1;
                            convertedPosts[convertedPosts.length - 1].ratings[lastRating].push({userName: row.ratingUserName});
                        }
                    }
                });

                const finalResult = {
                    name: result[0].threadName,
                    id: result[0].threadId,
                    posts: convertedPosts
                }

                res.send(finalResult);
            });
        
    })

    app.post('/api/forums/category/create', (req, res) => {
        controllers.createCategory(req.body.name)
            .then((newCategory) => {
                res.send({
                    id: newCategory.id
                });
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });
    })

    app.post('/api/forums/subcategory/create', (req, res) => {
        controllers.createSubCategory(req.body.name, req.body.description, req.body.categoryId, req.body.subCategoryId)
            .then((newSubCategory) => {
                res.send({
                    id: newSubCategory.id,
                    path: `/${newSubCategory.id}/${slugify(newSubCategory.name).toLowerCase()}`
                });
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });
    })

    app.post('/api/forums/thread/create', (req, res) => {
        controllers.createThread(req.body.name, req.body.content, req.body.userId, req.body.subCategoryId)
            .then((result) => {
                res.send({
                    threadId: result[0].id,
                    postId: result[1].id,
                    threadPath: `/thread/${result[0].id}/${slugify(result[0].name).toLowerCase()}`,
                    name: result[2].name,
                    createdOn: result[0].createdAt,
                    lastUpdated: result[1].updatedAt
                });
            })
            .catch((error) => {
                console.log(error)
                res.status(500).send({ error: 'Something failed!' })
            });
    })

    app.post('/api/forums/post/create', (req, res) => {
        controllers.createPost(req.body.content, req.body.userId, req.body.threadId)
            .then(({newPost, user}) => {
                controllers.getUserTotalPosts(req.body.userId)
                    .then(({user, count}) => {
                        console.log(newPost)
                        res.send({
                            id: newPost.id, 
                            content: newPost.content,
                            userName: user.name, 
                            userPicture: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/81/8117d1780455347891a44ccb80a45c6d693ebfae_full.jpg", 
                            userTotalPosts: count, 
                            userSignature: "to be implemented"
                        });
                    })
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });
    })

    app.post('/api/forums/user/create', (req, res) => {
        controllers.createUser(req.body.name)
            .then((newUser) => {
                res.send({
                    id: newUser.id
                });
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });
    })

    app.post('/api/forums/ratingtype/create', (req, res) => {
        controllers.createRatingType(req.body.name)
            .then(() => {
                res.send({});
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });
    })

    app.post('/api/forums/rating/create', (req, res) => {
        controllers.createRating(req.body.UserId, req.body.PostId, req.body.RatingTypeId)
            .then(() => {
                res.send({});
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });
    })
}