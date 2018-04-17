module.exports = (sequelize, DataTypes) => {
    
    const Category = sequelize.define('Category', {

        name: {
            type: DataTypes.STRING
        },

        position: {
            type: DataTypes.INTEGER
        }
        
    });

    return Category;
};