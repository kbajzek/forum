const models = require('../models');
const axios = require('axios');
const keys = require('../config/keys');

module.exports = {

    createCategory(name) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const {count} = await models.Category.findAndCountAll({transaction: t});
            return models.Category.create({name, position: count + 1 }, {transaction: t}); 
        });
    },

    createSubCategory(name, description, CategoryId, SubCategoryId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            if (CategoryId) {
                const {count} = await models.SubCategory.findAndCountAll({where: {CategoryId}, transaction: t});
                return models.SubCategory.create({name, description, position: count + 1, CategoryId}, {transaction: t});
            } else {
                const {count} = await models.SubCategory.findAndCountAll({where: {SubCategoryId}, transaction: t});
                const result = await models.SubCategory.findOne({where: {id: SubCategoryId}, transaction: t});
                let ancestors;
                if (result.ancestors) {
                    ancestors = "/" + SubCategoryId + result.ancestors;
                } else {
                    ancestors = "/" + SubCategoryId + "/";
                }
                return models.SubCategory.create({name, description, position: count + 1, SubCategoryId, ancestors}, {transaction: t}); 
            }
        });
    },

    createThread(name, content, UserId, SubCategoryId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const newThread = await models.Thread.create({name, SubCategoryId}, {transaction: t});
            const newPost = await models.Post.create({content, position: 1, ThreadId: newThread.id, UserId}, {transaction: t});
            const user = await models.User.findOne({where: {id: UserId}, transaction: t});
            return [newThread, newPost, user];
        });
    },

    createPost(content, UserId, ThreadId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const user = await models.User.findOne({where: {id: UserId}, transaction: t});
            const thread = await models.Thread.findOne({where: {id: ThreadId}, transaction: t});
            const {count} = await models.Post.findAndCountAll({where: {ThreadId}, transaction: t});
            const newPost = await models.Post.create({content, position: count + 1, ThreadId, UserId}, {transaction: t});
            return {newPost, user, thread};
        });
    },

    editPost(updatedContent, postId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const post = await models.Post.findOne({where: {id: postId}, transaction: t});
            const thread = models.Thread.findOne({where: {id: post.ThreadId}, transaction: t});
            const updatedPost = await post.updateAttributes({content: updatedContent}, {transaction: t});
            return {updatedPost, thread};
        });
    },

    deletePost(postId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const post = await models.Post.findOne({where: {id: postId}, transaction: t});
            if(post.position === 1){
                const thread = await models.Thread.findOne({where: {id: post.ThreadId}, transaction: t});
                const subCategory = await models.SubCategory.findOne({where: {id: thread.SubCategoryId}, transaction: t});
                await models.Thread.destroy({where: {id: post.ThreadId}, transaction: t});
                return [1, subCategory.id, subCategory.name];
            } else {
                await models.sequelize.query("UPDATE Posts SET position = position - 1 WHERE position > ? AND ThreadId = ?;" , { replacements: [post.position, post.ThreadId], type: models.Sequelize.QueryTypes.UPDATE, transaction: t});
                const post2 = await models.Post.findOne({where: {id: postId}, transaction: t});
                const thread = await models.Thread.findOne({where: {id: post2.ThreadId}, transaction: t});
                await models.Post.destroy({where: {id: postId}, transaction: t});
                return [2, thread.id, thread.name];
            }
        });
    },

    createMessage(name, content, members, owner) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const newMessage = await models.Message.create({name}, {transaction: t});
            const user = await models.MessageMember.create({permission: 2, UserId: owner, MessageId: newMessage.id}, {transaction: t});
            await models.sequelize.Promise.map(members, (member) => {
                return models.MessageMember.create({permission: 1, UserId: member, MessageId: newMessage.id}, {transaction: t})
            });
            const messagepost = await models.MessagePost.create({content, UserId: owner, MessageId: newMessage.id}, {transaction: t});
            return [newMessage, messagepost, user];
        });
    },

    createMessagePost(content, UserId, MessageId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const user = await models.User.findOne({where: {id: UserId}, transaction: t});
            const members = await models.MessageMember.findAll({where: {MessageId: MessageId}, transaction: t});
            const message = await models.Message.findOne({where: {id: MessageId}, transaction: t});
            const newPost = await models.MessagePost.create({content, MessageId, UserId}, {transaction: t});
            return {newPost, user, message, members};                
        });
    },

    editMessagePost(updatedContent, messagePostId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const post = await models.MessagePost.findOne({where: {id: messagePostId}, transaction: t});
            const message = await models.Message.findOne({where: {id: post.MessageId}, transaction: t});
            const members = await models.MessageMember.findAll({where: {MessageId: post.MessageId}, transaction: t});
            const updatedMessagePost = await post.updateAttributes({content: updatedContent}, {transaction: t});
            return {updatedMessagePost, message, members};
        });
    },

    deleteMessagePost(messagePostId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const post = await models.MessagePost.findOne({where: {id: messagePostId}, transaction: t});
            const message = await models.Message.findOne({where: {id: post.MessageId}, transaction: t});
            const count = await models.MessagePost.findAndCountAll({where: {MessageId: post.MessageId}, transaction: t});
            if(count === 1){
                await models.Message.destroy({where: {id: post.MessageId}, transaction: t});
                return [1];
            } else {
                await models.MessagePost.destroy({where: {id: messagePostId}, transaction: t});
                return [2, message];
            }
        });
    },

    getUserList(search) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, (t) => {
            return models.User.findAll({where: {name: {[models.sequelize.Op.like]: `%${search}%`}}, transaction: t});
        });
    },

    createUser(name, avatar) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, (t) => {
            return models.User.create({name, avatar}, {transaction: t}); 
        });
    },

    createRatingType(name) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, (t) => {
            return models.RatingType.create({name}, {transaction: t}); 
        });
    },

    createRating(UserId, PostId, RatingTypeId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const newRating = await models.Rating.create({UserId, PostId, RatingTypeId}, {transaction: t});
            const post = await models.Post.findOne({where: {id: PostId}, transaction: t});
            return {newRating, threadId: post.ThreadId};
        });
    },

    getUserTotalPosts(UserId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const {count} = await models.Post.findAndCountAll({where: {UserId}, transaction: t});
            const user = await models.User.findOne({where: {id: UserId}, transaction: t});
            return {user, count};
        });
    },

    deleteRating(ratingId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const rating = await models.Rating.findOne({where: {id: ratingId}, transaction: t});
            const post = await models.Post.findOne({where: {id: rating.PostId}, transaction: t});
            await models.Rating.destroy({where: {id: ratingId}, transaction: t});
            return post.ThreadId;
        });
    },

    removeMessageMember(memberId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            await models.MessageMember.destroy({where: {id: memberId}, transaction: t});
            return 1;
        });
    },

    getUserAvatars(usersParam) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const users = await models.User.findAll({where: {id: usersParam}, transaction: t});
            let userList = [];
            let userString = "";
            let count = 0;
            users.forEach((user,index) => {
                if(count >= 100){
                    count = 1;
                    userList.push(userString);
                    userString = user.steam;
                }else{
                    count++;
                    if(userString === ""){
                        userString = user.steam;
                    }else{
                        userString = userString + "," + user.steam;
                    }
                }
                if(index === users.length-1){
                    userList.push(userString);
                }
            });
            const results = await axios.all(userList.map(list => {
                const url = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=" + keys.steamAPIKey + "&steamids=" + list;
                return axios.get(url);
            }));
            let userMap = new Map();
            results.forEach(result => {
                result.data.response.players.forEach(player => {
                    userMap.set(player.steamid,player.avatarfull);
                });
            });
            const userAvatars = new Map();
            users.forEach(user => {
                userAvatars.set(user.id,userMap.get(user.steam));
            })
            return userAvatars;
        });
    },

}