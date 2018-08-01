module.exports = (sequelize, DataTypes) => {

    const SubCategory = sequelize.define('SubCategory', {

        name: {
            type: DataTypes.STRING
        },

        description: {
            type: DataTypes.STRING
        },

        ancestors: {
            type: DataTypes.STRING
        },

        position: {
            type: DataTypes.INTEGER
        }

    });

    SubCategory.associate = function (models) {
        models.SubCategory.belongsTo(models.Category, { onDelete: 'cascade' });
        models.SubCategory.belongsTo(models.SubCategory, { onDelete: 'cascade' });
    };

    return SubCategory;
};