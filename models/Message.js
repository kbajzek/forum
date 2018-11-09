module.exports = (sequelize, DataTypes) => {

    const message = sequelize.define('message', {

        name: {
            type: DataTypes.STRING
        },
        
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        }

    });

    return message;
};