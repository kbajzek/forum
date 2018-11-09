module.exports = (sequelize, DataTypes) => {

    const messagepost = sequelize.define('messagepost', {

        content: {
            type: DataTypes.TEXT
        }

    });

    messagepost.associate = function (models) {
        models.messagepost.belongsTo(models.user);
        models.messagepost.belongsTo(models.message, { onDelete: 'cascade' });
    };

    return messagepost;
};