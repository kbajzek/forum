const models = require('../models');
const axios = require('axios');
const keys = require('../config/keys');

module.exports = {

    createCategory(name) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const {count} = await models.category.findAndCountAll({transaction: t});
            return models.category.create({name, position: count + 1 }, {transaction: t}); 
        });
    },

    createSubCategory(name, description, categoryId, subcategoryId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            if (categoryId) {
                const {count} = await models.subcategory.findAndCountAll({where: {categoryId}, transaction: t});
                return models.subcategory.create({name, description, position: count + 1, categoryId}, {transaction: t});
            } else {
                const {count} = await models.subcategory.findAndCountAll({where: {subcategoryId}, transaction: t});
                const result = await models.subcategory.findOne({where: {id: subcategoryId}, transaction: t});
                let ancestors;
                if (result.ancestors) {
                    ancestors = "/" + subcategoryId + result.ancestors;
                } else {
                    ancestors = "/" + subcategoryId + "/";
                }
                return models.subcategory.create({name, description, position: count + 1, subcategoryId, ancestors}, {transaction: t}); 
            }
        });
    },

    createThread(name, content, userId, subcategoryId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const newThread = await models.thread.create({name, subcategoryId}, {transaction: t});
            const newPost = await models.post.create({content, position: 1, threadId: newThread.id, userId}, {transaction: t});
            const user = await models.user.findOne({where: {id: userId}, transaction: t});
            return [newThread, newPost, user];
        });
    },

    createPost(content, userId, threadId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const user = await models.user.findOne({where: {id: userId}, transaction: t});
            const thread = await models.thread.findOne({where: {id: threadId}, transaction: t});
            const {count} = await models.post.findAndCountAll({where: {threadId}, transaction: t});
            const newPost = await models.post.create({content, position: count + 1, threadId, userId}, {transaction: t});
            return {newPost, user, thread};
        });
    },

    editPost(updatedContent, postId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const post = await models.post.findOne({where: {id: postId}, transaction: t});
            const thread = await models.thread.findOne({where: {id: post.threadId}, transaction: t});
            const updatedPost = await post.updateAttributes({content: updatedContent}, {transaction: t});
            return {updatedPost, thread};
        });
    },

    deletePost(postId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const post = await models.post.findOne({where: {id: postId}, transaction: t});
            if(post.position === 1){
                const thread = await models.thread.findOne({where: {id: post.threadId}, transaction: t});
                const subCategory = await models.subcategory.findOne({where: {id: thread.subcategoryId}, transaction: t});
                await models.thread.destroy({where: {id: post.threadId}, transaction: t});
                return [1, subCategory.id, subCategory.name];
            } else {
                await models.sequelize.query("UPDATE Posts SET position = position - 1 WHERE position > ? AND threadId = ?;" , { replacements: [post.position, post.threadId], type: models.Sequelize.QueryTypes.UPDATE, transaction: t});
                const post2 = await models.post.findOne({where: {id: postId}, transaction: t});
                const thread = await models.thread.findOne({where: {id: post2.threadId}, transaction: t});
                await models.post.destroy({where: {id: postId}, transaction: t});
                return [2, thread.id, thread.name];
            }
        });
    },

    createMessage(name, content, members, owner) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const newMessage = await models.message.create({name}, {transaction: t});
            const user = await models.messagemember.create({permission: 2, userId: owner, messageId: newMessage.id}, {transaction: t});
            await models.sequelize.Promise.map(members, (member) => {
                return models.messagemember.create({permission: 1, userId: member, messageId: newMessage.id}, {transaction: t})
            });
            const messagepost = await models.messagepost.create({content, userId: owner, messageId: newMessage.id}, {transaction: t});
            return [newMessage, messagepost, user];
        });
    },

    createMessagePost(content, userId, messageId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const user = await models.user.findOne({where: {id: userId}, transaction: t});
            const members = await models.messagemember.findAll({where: {messageId: messageId}, transaction: t});
            const message = await models.message.findOne({where: {id: messageId}, transaction: t});
            const newPost = await models.messagepost.create({content, messageId, userId}, {transaction: t});
            return {newPost, user, message, members};                
        });
    },

    editMessagePost(updatedContent, messagepostId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const post = await models.messagepost.findOne({where: {id: messagepostId}, transaction: t});
            const message = await models.message.findOne({where: {id: post.messageId}, transaction: t});
            const members = await models.messagemember.findAll({where: {messageId: post.messageId}, transaction: t});
            const updatedMessagePost = await post.updateAttributes({content: updatedContent}, {transaction: t});
            return {updatedMessagePost, message, members};
        });
    },

    deleteMessagePost(messagepostId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const post = await models.messagepost.findOne({where: {id: messagepostId}, transaction: t});
            const message = await models.message.findOne({where: {id: post.messageId}, transaction: t});
            const count = await models.messagepost.findAndCountAll({where: {messageId: post.messageId}, transaction: t});
            if(count === 1){
                await models.message.destroy({where: {id: post.messageId}, transaction: t});
                return [1];
            } else {
                await models.messagepost.destroy({where: {id: messagepostId}, transaction: t});
                return [2, message];
            }
        });
    },

    getUserList(search) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, (t) => {
            return models.user.findAll({where: {name: {[models.sequelize.Op.like]: `%${search}%`}}, transaction: t});
        });
    },

    createUser(name, avatar) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, (t) => {
            return models.user.create({name, avatar}, {transaction: t}); 
        });
    },

    createRatingType(name) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, (t) => {
            return models.ratingtype.create({name}, {transaction: t}); 
        });
    },

    createRating(userId, postId, ratingtypeId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const newRating = await models.rating.create({userId, postId, ratingtypeId}, {transaction: t});
            const post = await models.post.findOne({where: {id: postId}, transaction: t});
            return {newRating, threadId: post.threadId};
        });
    },

    getUserTotalPosts(userId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const {count} = await models.post.findAndCountAll({where: {userId}, transaction: t});
            const user = await models.user.findOne({where: {id: userId}, transaction: t});
            return {user, count};
        });
    },

    deleteRating(ratingId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const rating = await models.rating.findOne({where: {id: ratingId}, transaction: t});
            const post = await models.post.findOne({where: {id: rating.postId}, transaction: t});
            await models.rating.destroy({where: {id: ratingId}, transaction: t});
            return post.threadId;
        });
    },

    removeMessageMember(memberId) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            await models.messagemember.destroy({where: {id: memberId}, transaction: t});
            return 1;
        });
    },

    getUserAvatars(usersParam) {
        return models.sequelize.transaction({isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
            const users = await models.user.findAll({where: {id: usersParam}, transaction: t});
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