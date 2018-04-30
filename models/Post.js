module.exports = (sequelize, DataTypes) => {

    const Post = sequelize.define('Post', {
            
        content: {
            type: DataTypes.TEXT
        },

        position: {
            type: DataTypes.INTEGER
        }
        
    });

    Post.associate = function (models) {
        models.Post.belongsTo(models.Thread, { onDelete: 'cascade' });
        models.Post.belongsTo(models.User);
    };

    return Post;
};