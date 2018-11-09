module.exports = (sequelize, DataTypes) => {

    const RatingType = sequelize.define('ratingtype', {

        name: {
            type: DataTypes.STRING
        }

    });

    return RatingType;
};