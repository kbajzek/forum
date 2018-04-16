module.exports = (sequelize, DataTypes) => {

    const RatingType = sequelize.define('RatingType', {

        name: {
            type: DataTypes.STRING
        }

    });

    return RatingType;
};