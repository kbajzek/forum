module.exports = (sequelize, DataTypes) => {

    const Thread = sequelize.define('Thread', {

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