module.exports = (sequelize, DataTypes) => {

    const subcategory = sequelize.define('subcategory', {

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

    subcategory.associate = function (models) {
        models.subcategory.belongsTo(models.category, { onDelete: 'cascade' });
        models.subcategory.belongsTo(models.subcategory, { onDelete: 'cascade' });
    };

    return subcategory;
};