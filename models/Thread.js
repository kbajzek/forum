module.exports = (sequelize, DataTypes) => {

    const thread = sequelize.define('thread', {

        name: {
            type: DataTypes.STRING
        },

        total_views: {
            type: DataTypes.INTEGER
        }    

    });

    thread.associate = function (models) {
        models.thread.belongsTo(models.subcategory, { onDelete: 'cascade' });
    };

    return thread;
};