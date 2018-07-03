module.exports = (sequelize, DataTypes) => {

    const Message = sequelize.define('Message', {

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