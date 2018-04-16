module.exports = (sequelize, DataTypes) => {

    const Post = sequelize.define('Post', {
            
        content: {
            type: DataTypes.TEXT
        },
        
    });

    Post.associate = function (models) {
        models.Post.belongsTo(models.Thread);
        models.Post.belongsTo(models.User);
    };

    return Post;
};