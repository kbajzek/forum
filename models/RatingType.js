module.exports = (sequelize, DataTypes) => {

    const ratingtype = sequelize.define('ratingtype', {

        name: {
            type: DataTypes.STRING
        }

    });

    return ratingtype;
};