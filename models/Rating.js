module.exports = (sequelize, DataTypes) => {

    const Rating = sequelize.define('Rating', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        }

    });

    Rating.associate = function (models) {
        models.Rating.belongsTo(models.User);
        models.Rating.belongsTo(models.Post);
        models.Rating.belongsTo(models.RatingType);
    };

    return Rating;
};