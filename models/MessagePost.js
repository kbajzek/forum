module.exports = (sequelize, DataTypes) => {

    const MessagePost = sequelize.define('MessagePost', {

        content: {
            type: DataTypes.TEXT
        }

    });

    MessagePost.associate = function (models) {
        models.MessagePost.belongsTo(models.User);
        models.MessagePost.belongsTo(models.Message, { onDelete: 'cascade' });
    };

    return MessagePost;
};