module.exports = (sequelize, DataTypes) => {

    const post = sequelize.define('post', {
            
        content: {
            type: DataTypes.TEXT
        },

        position: {
            type: DataTypes.INTEGER
        }
        
    });

    post.associate = function (models) {
        models.post.belongsTo(models.thread, { onDelete: 'cascade' });
        models.post.belongsTo(models.user);
    };

    return post;
};