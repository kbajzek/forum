module.exports = (sequelize, DataTypes) => {

    const Thread = sequelize.define('thread', {

        name: {
            type: DataTypes.STRING
        },

        total_views: {
            type: DataTypes.INTEGER
        }    

    });

    Thread.associate = function (models) {
        models.Thread.belongsTo(models.SubCategory, { onDelete: 'cascade' });
    };

    return Thread;
};