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
            type: DataTypes.STRING(50000)
        }
    },
    {
        tableName: 'session'
    });

    return session;

};