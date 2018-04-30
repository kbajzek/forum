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
                        return models.Post.findAndCountAll({where: {ThreadId}, transaction: t})
                            .then(function ({count}) {
                                return models.Post.create({
                                    content,
                                    position: count + 1,
                                    ThreadId,
                                    UserId
                                }, {transaction: t})
                                    .then(function(newPost) {
                                        return {newPost, user};
                                    });
                            });
                    });
                
            });
        },

        editPost(updatedContent, postId) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                return models.Post.findOne({where: {id: postId}, transaction: t})
                    .then(function(post) {
                        return post.updateAttributes({content: updatedContent}, {transaction: t});
                    });
                
            });
        },

        deletePost(postId) {
            return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, function (t) {
                return models.Post.findOne({where: {id: postId}, transaction: t})
                    .then(function(post) {
                        
                        if(post.position === 1){
                            return models.Thread.destroy({where: {id: post.ThreadId}, transaction: t})
                                .then((result) => {
                                    return 1;
                                });
                        } else {
                            return models.sequelize.query("UPDATE Posts SET position = position - 1 WHERE position > ? AND ThreadId = ?;" , { replacements: [post.position, post.ThreadId], type: models.Sequelize.QueryTypes.UPDATE, transaction: t})
                                .then(() => {
                                    return models.Post.destroy({where: {id: postId}, transaction: t})
                                        .then((result) => {
                                            return 2;
                                        });
                                })
                        }
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
    
}