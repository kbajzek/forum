module.exports = (sequelize, DataTypes) => {

    const MessageMember = sequelize.define('messagemember', {

        permission: {
            type: DataTypes.INTEGER, // 1 = normal, 2 = owner
            defaultValue: 1
        },

    });

    MessageMember.associate = function (models) {
        models.MessageMember.belongsTo(models.Message, { onDelete: 'cascade' });
        models.MessageMember.belongsTo(models.User);
    };

    return MessageMember;
};