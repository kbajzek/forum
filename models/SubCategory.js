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
        }

    });

    SubCategory.associate = function (models) {
        models.SubCategory.belongsTo(models.Category);
        models.SubCategory.belongsTo(models.SubCategory);
    };

    return SubCategory;
};