module.exports = (sequelize, DataTypes) => {

    const Message = sequelize.define('message', {

        name: {
            type: DataTypes.STRING
        },
        
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        }

    });

    return Message;
};