module.exports = (sequelize, DataTypes) => {
    
    const category = sequelize.define('category', {

        name: {
            type: DataTypes.STRING
        },

        position: {
            type: DataTypes.INTEGER
        }
        
    });

    return category;
};