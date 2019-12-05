module.exports = (sequelize, DataTypes) => {

    const session = sequelize.define('session', {

        sid: {
            type: DataTypes.STRING,
            primaryKey: true
        },
    
        expires: {
            type: DataTypes.DATE
        },
        
        data: {
            type: DataTypes.TEXT
        }
    },
    {
        tableName: 'session'
    });

    return session;

};