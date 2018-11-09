module.exports = (sequelize, DataTypes) => {

    const Rating = sequelize.define('rating', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        }

    });

    Rating.associate = function (models) {
        models.Rating.belongsTo(models.User);
        models.Rating.belongsTo(models.Post, { onDelete: 'cascade' });
        models.Rating.belongsTo(models.RatingType);
    };

    return Rating;
};