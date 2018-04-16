const Sequelize = require('sequelize');
const sequelize = new Sequelize('forum_test', 'username', 'password', {
    dialect: 'mysql',
});

const Rating = sequelize.define('Rating', {

    rating_id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    }

});

const User = sequelize.define('User', {

    user_id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    }

});

const Post = sequelize.define('Post', {
    
    post_id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT
    },
    
});

const Thread = sequelize.define('Thread', {

    thread_id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    total_views: {
        type: DataTypes.INTEGER
    }    
});

const SubCategory = sequelize.define('SubCategory', {

    subcategory_id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    }
});

const Category = sequelize.define('Category', {

    category_id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    } 
    
});

Rating.hasOne(User);

Post.hasMany(Rating);
Post.hasOne(User);

Thread.hasMany(Post);

SubCategory.hasMany(Thread);
SubCategory.hasMany(SubCategory);

Category.hasMany(SubCategory);