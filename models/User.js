module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {

        name: {
            type: DataTypes.STRING
        },
        
        steam: {
            type: DataTypes.STRING
        },

        avatar: {
            type: DataTypes.STRING
        }

    });

    return User;
};