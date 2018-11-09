module.exports = (sequelize, DataTypes) => {

    const messagemember = sequelize.define('messagemember', {

        permission: {
            type: DataTypes.INTEGER, // 1 = normal, 2 = owner
            defaultValue: 1
        },

    });

    messagemember.associate = function (models) {
        models.messagemember.belongsTo(models.message, { onDelete: 'cascade' });
        models.messagemember.belongsTo(models.user);
    };

    return messagemember;
};