const models = require('../models');

module.exports = {
    

        createCategory(name) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                return models.Category.findAndCountAll({transaction: t})
                    .then(function ({count}) {
                        return models.Category.create({
                            name,
                            position: count + 1
                        }, {transaction: t}); 
                    });
            });
        },

        createSubCategory(name, description, CategoryId, SubCategoryId) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                if (CategoryId) {
                    return models.SubCategory.findAndCountAll({where: {CategoryId}, transaction: t})
                        .then(function ({count}) {
                            return models.SubCategory.create({
                                name,
                                description,
                                position: count + 1,
                                CategoryId
                            }, {transaction: t}); 
                        });
                } else {
                    return models.SubCategory.findAndCountAll({where: {SubCategoryId}, transaction: t})
                        .then(function ({count}) {
                            return models.SubCategory.findOne({where: {id: SubCategoryId}, transaction: t})
                                .then(function (result) {
                                    let ancestors;
                                    if (result.ancestors) {
                                        ancestors = "/" + SubCategoryId + result.ancestors
                                    } else {
                                        ancestors = "/" + SubCategoryId + "/";
                                    }

                                    return models.SubCategory.create({
                                        name,
                                        description,
                                        position: count + 1,
                                        SubCategoryId,
                                        ancestors
                                    }, {transaction: t}); 
                                });
                        });
                }
                
            });
        },

        createThread(name, content, UserId, SubCategoryId) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                return models.Thread.create({
                    name,
                    SubCategoryId
                }, {transaction: t})
                    .then(function (newThread) {
                        return models.Post.create({
                            content,
                            position: 1,
                            ThreadId: newThread.id,
                            UserId
                        }, {transaction: t})
                            .then(function (newPost) {
                                return models.User.findOne({where: {id: UserId}, transaction: t})
                                    .then(function(user) {
                                        return [newThread, newPost, user];
                                    });
                            });
                    });
            });
        },

        createPost(content, UserId, ThreadId) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                return models.User.findOne({where: {id: UserId}, transaction: t})
                    .then(function(user) {
                        return models.Thread.findOne({where: {id: ThreadId}, transaction: t})
                            .then(function(thread) {
                                return models.Post.findAndCountAll({where: {ThreadId}, transaction: t})
                                    .then(function ({count}) {
                                        return models.Post.create({
                                            content,
                                            position: count + 1,
                                            ThreadId,
                                            UserId
                                        }, {transaction: t})
                                            .then(function(newPost) {
                                                return {newPost, user, thread};
                                            });
                                    });
                            });
                    });
                
            });
        },

        editPost(updatedContent, postId) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                return models.Post.findOne({where: {id: postId}, transaction: t})
                    .then(function(post) {
                        return models.Thread.findOne({where: {id: post.ThreadId}, transaction: t})
                            .then(function(thread) {
                                return post.updateAttributes({content: updatedContent}, {transaction: t})
                                    .then(function(updatedPost) {
                                        return {updatedPost, thread};
                                    });
                            });
                    });
                
            });
        },

        deletePost(postId) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                return models.Post.findOne({where: {id: postId}, transaction: t})
                    .then(function(post) {
                        
                        if(post.position === 1){
                            return models.Thread.findOne({where: {id: post.ThreadId}, transaction: t})
                                .then((thread) => {
                                    return models.SubCategory.findOne({where: {id: thread.SubCategoryId}, transaction: t})
                                        .then((subCategory) => {
                                            return models.Thread.destroy({where: {id: post.ThreadId}, transaction: t})
                                                .then((result) => {
                                                    return [1, subCategory.id, subCategory.name];
                                                });
                                        });
                                });
                        } else {
                            return models.sequelize.query("UPDATE Posts SET position = position - 1 WHERE position > ? AND ThreadId = ?;" , { replacements: [post.position, post.ThreadId], type: models.Sequelize.QueryTypes.UPDATE, transaction: t})
                                .then(() => {
                                    return models.Post.findOne({where: {id: postId}, transaction: t})
                                        .then((post) => {
                                            return models.Thread.findOne({where: {id: post.ThreadId}, transaction: t})
                                                .then((thread) => {
                                                    return models.Post.destroy({where: {id: postId}, transaction: t})
                                                        .then((result) => {
                                                            return [2, thread.id, thread.name];
                                                        });
                                                });
                                        });
                                })
                        }
                    });
            });
        },

        createMessage(name, content, members, owner) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                return models.Message.create({
                    name
                }, {transaction: t})
                    .then(function(newMessage) {
                        const perm = 2;
                        return models.MessageMember.create({
                            permission: perm,
                            UserId: owner,
                            MessageId: newMessage.id
                        }, {transaction: t})
                            .then(function(user) {
                                const perm = 1;
                                return models.sequelize.Promise.map(members, function(member){
                                    return models.MessageMember.create({
                                        permission: perm,
                                        UserId: member,
                                        MessageId: newMessage.id
                                    }, {transaction: t})
                                })
                                    .then(function(newMembers) {
                                        return models.MessagePost.create({
                                            content,
                                            UserId: owner,
                                            MessageId: newMessage.id
                                        }, {transaction: t})
                                            .then(function(messagepost) {
                                                return [newMessage, messagepost, user];
                                            });
                                    });
                            });
                    });
            });
        },

        createMessagePost(content, UserId, MessageId) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                return models.User.findOne({where: {id: UserId}, transaction: t})
                    .then(function(user) {
                        return models.MessageMember.findAll({where: {MessageId: MessageId}, transaction: t})
                            .then(function (members) {
                                return models.Message.findOne({where: {id: MessageId}, transaction: t})
                                    .then(function (message) {
                                        return models.MessagePost.create({
                                            content,
                                            MessageId,
                                            UserId
                                        }, {transaction: t})
                                            .then(function(newPost) {
                                                return {newPost, user, message, members};
                                            });
                                    });
                            });
                    });
                
            });
        },

        editMessagePost(updatedContent, messagePostId) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                return models.MessagePost.findOne({where: {id: messagePostId}, transaction: t})
                    .then(function(post) {
                        return models.Message.findOne({where: {id: post.MessageId}, transaction: t})
                            .then(function(message) {
                                return models.MessageMember.findAll({where: {MessageId: post.MessageId}, transaction: t})
                                    .then(function(members) {
                                        return post.updateAttributes({content: updatedContent}, {transaction: t})
                                            .then(function(updatedMessagePost) {
                                                return {updatedMessagePost, message, members};
                                            });
                                    });
                            });
                    });
            });
        },

        deleteMessagePost(messagePostId) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                return models.MessagePost.findOne({where: {id: messagePostId}, transaction: t})
                    .then(function(post) {
                        return models.Message.findOne({where: {id: post.MessageId}, transaction: t})
                            .then(function(message) {
                                return models.MessagePost.findAndCountAll({where: {MessageId: post.MessageId}, transaction: t})
                                    .then(function({count}) {
                                        if(count === 1){
                                            return models.Message.destroy({where: {id: post.MessageId}, transaction: t})
                                                .then((result) => {
                                                    return [1];
                                                });
                                        } else {
                                            return models.MessagePost.destroy({where: {id: messagePostId}, transaction: t})
                                                .then((result) => {
                                                    return [2, message];
                                                });
                                        }
                                    });
                                
                            });
                    });
            });
        },

        getUserList(search) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                return models.User.findAll({where: {name: {[models.sequelize.Op.like]: `%${search}%`}}, transaction: t})
                    .then(function(users) {
                        return users;
                    });
                
            });
        },

        createUser(name) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                return models.User.create({
                    name,
                }, {transaction: t}); 
            });
        },

        createRatingType(name) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                return models.RatingType.create({
                    name,
                }, {transaction: t}); 
            });
        },

        createRating(UserId, PostId, RatingTypeId) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                return models.Rating.create({
                    UserId,
                    PostId,
                    RatingTypeId
                }, {transaction: t}); 
            });
        },

        getUserTotalPosts(UserId) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                return models.Post.findAndCountAll({where: {UserId}, transaction: t})
                    .then(function ({count}) {
                        return models.User.findOne({where: {id: UserId}, transaction: t})
                            .then(function (user) {
                                return {user, count};
                            });
                    });
            });
        },

        deleteRating(UserId, PostId) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                return models.Rating.destroy({where: {postId: PostId, userId: UserId}, transaction: t})
                    .then(function(result) {
                        return 1;
                    });
            });
        },

        removeMessageMember(memberId) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                return models.MessageMember.destroy({where: {id: memberId}, transaction: t})
                    .then(function(result) {
                        return 1;
                    });
            });
        },
    
}