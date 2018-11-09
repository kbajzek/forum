module.exports = (sequelize, DataTypes) => {
    
    const Category = sequelize.define('category', {

        name: {
            type: DataTypes.STRING
        },

        position: {
            type: DataTypes.INTEGER
        }
        
    });

    return Category;
};