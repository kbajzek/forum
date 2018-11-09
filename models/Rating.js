module.exports = (sequelize, DataTypes) => {

    const rating = sequelize.define('rating', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        }

    });

    rating.associate = function (models) {
        models.rating.belongsTo(models.user);
        models.rating.belongsTo(models.post, { onDelete: 'cascade' });
        models.rating.belongsTo(models.ratingtype);
    };

    return rating;
};