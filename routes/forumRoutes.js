const assert = require('assert');
const slugify = require('slugify');
const models  = require('../models');
const queries = require('../controllers/queries');
const sqlstring = require('sqlstring');
const controllers = require('../controllers/controllers');
const requireCSRF = require('../middlewares/requireCSRF');
const requireLogin = require('../middlewares/requireLogin');
const checkCanRate = require('../middlewares/checkCanRate');
const checkCanUnrate = require('../middlewares/checkCanUnrate');
const checkCanRemoveMessageMember = require('../middlewares/checkCanRemoveMessageMember');

module.exports = (app,io,ioUsers,ioLocations,setUserLocation) => {

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
        try {
            models.sequelize.query(queries.getCategoriesQuery(), { type: models.Sequelize.QueryTypes.SELECT})
                .then(result => {

                    let convertedResult = [];
                    let currentCatPosition = 0;

                    result.forEach((row) => {

                        let lastUpdated = row.maxDate || 'none';
                        let lastThreadName = row.ThreadName || 'none';
                        let lastUser = row.UserName || 'none';
                        let lastActiveThreadPath = row.ThreadId ? `/thread/${row.ThreadId}/${slugify(row.ThreadName).toLowerCase()}#${row.postId}` : 'none';

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

                    setUserLocation(req.session.passport.user,'1');
                    console.log(ioLocations.get('1'))

                    const finalResult = {
                        categories: convertedResult,
                        usersViewing: ioLocations.get('1'),
                    }
                    
                    res.send(finalResult);
                })
        } catch(err) {
            res.status(404).send({ error: 'Something failed!' });
        }
    })

    app.get('/api/forums/subcategory/:id', async (req, res) => {
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
                let lastActiveThreadPath = row.ThreadId ? `/thread/${row.ThreadId}/${slugify(row.ThreadName).toLowerCase()}#${row.postId}` : 'none';

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
                slug: slugify(result3[0].name).toLowerCase(),
                subCategories: convertedResult,
                threads: convertedResult2,
                path: `/${subcatid}/${slugify(result3[0].name).toLowerCase()}`,
            }
            setUserLocation(req.session.passport.user,'1/'+subcatid);
            res.send(finalResult);
        } catch(err) {
            res.status(404).send({ error: 'Something failed!' });
        }
    })

    app.get('/api/forums/thread/:id', (req, res) => {
        try {
            let threadId = Number(req.params.id);
            models.RatingType.findAll({ type: models.Sequelize.QueryTypes.SELECT})
                .then(ratingTypes => {
                    models.sequelize.query(queries.getThreadQuery(threadId), { type: models.Sequelize.QueryTypes.SELECT})
                        .then(result => {

                            let convertedPosts = [];
                            let currentPostPosition = 0;
                            let currentRatingTypeId = 0;

                            result.forEach((row) => {

                                let rating;
                                //if rating is not null, build it. If it exists, it will always have a user
                                if (row.ratingName) {
                                    rating = {
                                        ratingName: row.ratingName,
                                        users: [
                                            {
                                                userName: row.ratingUserName, 
                                                ratingId: row.ratingId, 
                                                userId: row.ratingUserId, 
                                                path: `/user/${row.ratingUserId}/${slugify(row.ratingUserName).toLowerCase()}`
                                            }
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
                                                userId: row.creatorId,
                                                path: `/user/${row.creatorId}/${slugify(row.creatorName).toLowerCase()}`,
                                                pictureURL: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/81/8117d1780455347891a44ccb80a45c6d693ebfae_full.jpg",
                                                totalPosts: row.postCount,
                                                signature: "to be implemented"
                                            }
                                        }
                                    );

                                    if (rating) {
                                        // add a new rating, reset current rating placeholder
                                        currentRatingTypeId = row.ratingTypeId;
                                        convertedPosts[convertedPosts.length - 1].ratings.push(rating);
                                    }
                                } else {
                                    //there has to be at least 1 rating to get to here, and user has to exist
                                    if (currentRatingTypeId !== row.ratingTypeId) {
                                        currentRatingTypeId = row.ratingTypeId;
                                        // another rating type
                                        convertedPosts[convertedPosts.length - 1].ratings.push(rating);
                                    } else {
                                        // same rating type, different user
                                        const lastRating = convertedPosts[convertedPosts.length - 1].ratings.length - 1;
                                        convertedPosts[convertedPosts.length - 1].ratings[lastRating].users.push({
                                            userName: row.ratingUserName, 
                                            ratingId: row.ratingId, 
                                            userId: row.ratingUserId, 
                                            path: `/user/${row.ratingUserId}/${slugify(row.ratingUserName).toLowerCase()}`
                                        });
                                    }
                                }
                            });

                            const ratings = ratingTypes.map((ratingType) => {
                                return {
                                    id: ratingType.id,
                                    name: ratingType.name
                                };
                            })

                            setUserLocation(req.session.passport.user,'2/'+threadId);

                            const finalResult = {
                                id: result[0].threadId,
                                name: result[0].threadName,
                                slug: slugify(result[0].threadName).toLowerCase(),
                                posts: convertedPosts,
                                ratingTypes: ratings,
                                path: `/thread/${result[0].threadId}/${slugify(result[0].threadName).toLowerCase()}`,
                                usersViewing: ioLocations.get('2/'+threadId),
                            }
                            
                            res.send(finalResult);
                        });
                });
        } catch(err) {
            res.status(404).send({ error: 'Something failed!' });
        }
    })

    app.get('/api/forums/user/:id/:slug', (req, res) => {
        try {
            let userId = Number(req.params.id);
            
            models.sequelize.query(queries.getUserQuery(userId), { type: models.Sequelize.QueryTypes.SELECT})
                .then(result => {
                    let convertedPosts = [];

                    result.forEach((row) => {

                        convertedPosts.push(
                            {
                                id: row.postId,
                                content: row.postContent,
                                createdAt: row.postCreatedAt,
                                threadName: row.threadName,
                                path: `/thread/${row.postThreadId}/${slugify(row.threadName).toLowerCase()}#${row.postId}`
                            }
                        );
                        
                    });

                    setUserLocation(req.session.passport.user,'3/'+userId);

                    let userData = {
                        userName: result[0].userName,
                        posts: convertedPosts,
                        usersViewing: ioLocations.get('3/'+userId),
                    }
                    
                    res.send(userData);
                })
        } catch(err) {
            res.status(404).send({ error: 'Something failed!' });
        }
    });

    app.get('/api/forums/message', requireLogin, (req, res) => {
        try {
            models.sequelize.query(queries.getUserMessageListQuery(req.session.passport.user), { type: models.Sequelize.QueryTypes.SELECT})
                .then(result => {
                    let convertedMessageHeaders = [];
                    let convertedMessagePosts = [];

                    result.forEach((row) => {

                        convertedMessageHeaders.push(
                            {
                                id: row.messageId,
                                name: row.messageName,
                                path: `/message/${row.messageId}/${slugify(row.messageName).toLowerCase()}`
                            }
                        );
                        
                    });

                    let messageData = {
                        messageList: convertedMessageHeaders,
                        messageSelected: null
                    }
                    setUserLocation(req.session.passport.user,'4');
                    res.send(messageData);
                })
        } catch(err) {
            res.status(404).send({ error: 'Something failed!' });
        }
    });

    app.get('/api/forums/message/:id/:slug', requireLogin, async (req, res) => {
        try {
            let messageId = Number(req.params.id);
            
            let result = await models.sequelize.query(queries.getUserMessageListQuery(req.session.passport.user), { type: models.Sequelize.QueryTypes.SELECT});
            let result2 = await models.sequelize.query(queries.getMessageQuery(messageId), { type: models.Sequelize.QueryTypes.SELECT});
            let result3 = await models.sequelize.query(queries.getMessageMembersQuery(messageId), { type: models.Sequelize.QueryTypes.SELECT});
                        
            let convertedMessageHeaders = [];
            let convertedMessagePosts = [];
            let convertedMessageMembers = [];

            result.forEach((row) => {

                convertedMessageHeaders.push(
                    {
                        id: row.messageId,
                        name: row.messageName,
                        path: `/message/${row.messageId}/${slugify(row.messageName).toLowerCase()}`
                    }
                );
                
            });

            result2.forEach((row) => {

                convertedMessagePosts.push(
                    {
                        id: row.messagePostId,
                        content: row.messagePostContent,
                        creatorId: row.messageCreatorId,
                        creatorName: row.messageCreatorName,
                        creatorPath: `/user/${row.messageCreatorId}/${slugify(row.messageCreatorName).toLowerCase()}`,
                        creatorPictureURL: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/81/8117d1780455347891a44ccb80a45c6d693ebfae_full.jpg",
                        creatorPostCount: row.messageCreatorPostCount
                    }
                );
                
            });

            result3.forEach((row) => {

                convertedMessageMembers.push(
                    {
                        id: row.memberId,
                        userId: row.userId,
                        userName: row.userName,
                        permission: row.memberPermission,
                        memberPath: `/user/${row.userId}/${slugify(row.userName).toLowerCase()}`,
                        memberPictureURL: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/81/8117d1780455347891a44ccb80a45c6d693ebfae_full.jpg"
                    }
                );
                
            });

            const perm = result3.find((row) => row.userId === req.session.passport.user);

            const messageName = result2[0] ? result2[0].messageName : '';

            let messageData = {
                messageList: convertedMessageHeaders,
                messageSelected: {
                    messageId: messageId,
                    messageName: messageName,
                    messagePerm: perm.memberPermission,
                    posts: convertedMessagePosts,
                    members: convertedMessageMembers,
                }
            }
            setUserLocation(req.session.passport.user,'4/'+messageId);
            res.send(messageData);
        } catch(err) {
            res.status(404).send({ error: 'Something failed!' });
        }
    });

    app.get('/api/forums/userlist', (req, res) => {
        controllers.getUserList(req.query.search)
            .then((users) => {
                const userList = users.map((user) => {return {key: user.id, label: user.name}}).filter((user) => {return user.key !== req.session.passport.user})
                res.send({users: userList});
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });

    });

    app.post('/api/forums/category/create', requireCSRF, requireLogin, (req, res) => {
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

    app.post('/api/forums/subcategory/create', requireCSRF, requireLogin, (req, res) => {
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

    app.post('/api/forums/thread/create', requireCSRF, requireLogin, (req, res) => {
        controllers.createThread(req.body.name, req.body.content, req.session.passport.user, req.body.subCategoryId)
            .then((result) => {
                res.send({
                    threadId: result[0].id,
                    postId: result[1].id,
                    path: `/thread/${result[0].id}/${slugify(result[0].name).toLowerCase()}`,
                    name: result[2].name,
                    createdOn: result[0].createdAt,
                    lastUpdated: result[1].updatedAt
                });
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });
    })

    app.post('/api/forums/post/create', requireCSRF, requireLogin, (req, res) => {
        controllers.createPost(req.body.content, req.session.passport.user, req.body.threadId)
            .then(({newPost, user, thread}) => {
                controllers.getUserTotalPosts(req.session.passport.user)
                    .then(({user, count}) => {
                        res.send({
                            postId: newPost.id, 
                            content: newPost.content,
                            threadId: req.body.threadId,
                            hash: `#${newPost.id}`,
                            path: `/thread/${req.body.threadId}/${slugify(thread.name).toLowerCase()}`,
                            userName: user.name, 
                            userTotalPosts: count, 
                            userSignature: "to be implemented"
                        });
                    })
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });
    })

    app.post('/api/forums/post/edit', requireCSRF, requireLogin, (req, res) => {
        controllers.editPost(req.body.content, req.body.postId)
            .then(({updatedPost, thread}) => {
                res.send({
                    postId: updatedPost.id,
                    threadId: thread.id,
                    hash: `#${updatedPost.id}`,
                    path: `/thread/${thread.id}/${slugify(thread.name).toLowerCase()}`
                });
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });
    })

    app.post('/api/forums/post/delete', requireCSRF, requireLogin, (req, res) => {
        
        controllers.deletePost(req.body.postId)
            .then((response) => {//response = 1: post position was #1, thread deleted; response = 2: post deleted and positions updated
                res.send({
                    response: response[0],
                    threadId: response[1],
                    path: `/thread/${response[1]}/${slugify(response[2]).toLowerCase()}`
                });
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });
    })

    app.post('/api/forums/message/create', requireCSRF, requireLogin, (req, res) => {
        const members = req.body.members.map(member => member.key);
        controllers.createMessage(req.body.name, req.body.content, members, req.session.passport.user)
            .then((result) => {
                res.send({
                    message: result[0].id,
                    messagePostId: result[1].id,
                    path: `/message/${result[0].id}/${slugify(result[0].name).toLowerCase()}`,
                    createdOn: result[0].createdAt,
                    lastUpdated: result[1].updatedAt
                });
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });
    })

    app.post('/api/forums/messagepost/create', requireCSRF, requireLogin, (req, res) => {
        controllers.createMessagePost(req.body.content, req.session.passport.user, req.body.messageId)
            .then(({newPost, user, message, members}) => {
                members.forEach((member) => {
                    if(member.UserId !== req.session.passport.user){
                        const socketID = ioUsers.get(member.UserId);
                        if(socketID && socketID !== undefined){
                            io.to(socketID).emit('messages.update', req.body.messageId);
                        }
                    }
                })
                res.send({
                    postId: newPost.id, 
                    content: newPost.content,
                    messageId: req.body.messageId,
                    userName: user.name,
                    path: `/message/${message.id}/${slugify(message.name).toLowerCase()}`,
                });
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });
    })

    app.post('/api/forums/messagepost/edit', requireCSRF, requireLogin, (req, res) => {
        controllers.editMessagePost(req.body.content, req.body.messagePostId)
            .then(({updatedMessagePost, message}) => {
                res.send({
                    messagePostId: updatedMessagePost.id,
                    path: `/message/${message.id}/${slugify(message.name).toLowerCase()}`,
                });
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });
    })

    app.post('/api/forums/messagepost/delete', requireCSRF, requireLogin, (req, res) => {
        controllers.deleteMessagePost(req.body.messagePostId)
            .then((response) => {//response = 1: post position was #1, thread deleted; response = 2: post deleted and positions updated
                let path;
                if(response[0] === 1){
                    path = `/message`
                }else{
                    path = `/message/${response[1].id}/${slugify(response[1].name).toLowerCase()}`
                }
                res.send({
                    response: response[0],
                    path: path
                });
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });
    })

    app.post('/api/forums/user/create', requireCSRF, requireLogin, (req, res) => {
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

    app.post('/api/forums/ratingtype/create', requireCSRF, requireLogin, (req, res) => {
        controllers.createRatingType(req.body.name)
            .then(() => {
                res.send({});
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });
    })

    app.post('/api/forums/rating/create', requireCSRF, requireLogin, checkCanRate, (req, res) => {
        controllers.createRating(req.session.passport.user, req.body.postId, req.body.ratingTypeId)
            .then(({newRating, threadId}) => {
                res.send({
                    ratingId: newRating,
                    threadId: threadId
                });
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });
    })

    app.post('/api/forums/rating/delete', requireCSRF, requireLogin, checkCanUnrate, (req, res) => {
        controllers.deleteRating(req.body.ratingId)
            .then((threadId) => {
                res.send({
                    response: 1,
                    threadId: threadId
                });
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });
    })

    app.post('/api/forums/messagemember/delete', requireCSRF, requireLogin, checkCanRemoveMessageMember, (req, res) => {
        controllers.removeMessageMember(req.body.memberId)
            .then((response) => {
                res.send({
                    response: response
                });
            })
            .catch((error) => {
                res.status(500).send({ error: 'Something failed!' })
            });
    })
}