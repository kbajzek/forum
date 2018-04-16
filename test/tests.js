const assert = require('assert');
const slugify = require('slugify');
const models  = require('../models');

describe('Tests', () => {

    before((done) => {
        models.sequelize
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
                done();
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });
    });
 
    beforeEach((done) => {
        models.sequelize.drop()
            .then(() => {
                models.sequelize.sync({force: true}).then( async () => {

                    let user, ratingType, ratingType2, post, post2, post3, post4, thread, 
                    thread2, subCategory, subCategory2, subCategory3, subCategory4, subCategory5, category,
                    rating, rating1, rating2, rating3, rating4, rating5, rating6, rating7, rating8, rating9;
                    
                    user = await models.User.create({name: 'User 1'});
                    category = await models.Category.create({name: 'Category 1'});
                    subCategory = await models.SubCategory.create({name: 'SubCategory 1', description: 'first subcategory', CategoryId: category.id});
                    subCategory2 = await models.SubCategory.create({name: 'SubCategory 2', description: 'second subcategory', CategoryId: category.id});
                    subCategory3 = await models.SubCategory.create({name: 'SubCategory 3', description: 'third subcategory', SubCategoryId: subCategory2.id, ancestors: '2'});
                    subCategory4 = await models.SubCategory.create({name: 'SubCategory 4', description: 'fourth subcategory', SubCategoryId: subCategory3.id, ancestors: '3,2'});
                    subCategory5 = await models.SubCategory.create({name: 'SubCategory 5', description: 'fifth subcategory', SubCategoryId: subCategory.id, ancestors: '1'});
                    thread = await models.Thread.create({name: 'Thread 1', SubCategoryId: subCategory.id});
                    thread2 = await models.Thread.create({name: 'Thread 2', SubCategoryId: subCategory.id});
                    thread3 = await models.Thread.create({name: 'Thread 3', SubCategoryId: subCategory5.id});
                    post = await models.Post.create({content: 'content 1', UserId: user.id, ThreadId: thread.id});
                    post2 = await models.Post.create({content: 'content 2', UserId: user.id, ThreadId: thread.id});
                    post3 = await models.Post.create({content: 'content 3', UserId: user.id, ThreadId: thread2.id});
                    post4 = await models.Post.create({content: 'content 4', UserId: user.id, ThreadId: thread2.id});
                    post5 = await models.Post.create({content: 'content 5', UserId: user.id, ThreadId: thread3.id});
                    ratingType = await models.RatingType.create({name: 'Like'});
                    ratingType2 = await models.RatingType.create({name: 'Dislike'});
                    rating = await models.Rating.create({UserId: user.id, PostId: post.id, RatingTypeId: ratingType.id});
                    rating1 = await models.Rating.create({UserId: user.id, PostId: post.id, RatingTypeId: ratingType2.id});
                    rating2 = await models.Rating.create({UserId: user.id, PostId: post2.id, RatingTypeId: ratingType.id});
                    rating3 = await models.Rating.create({UserId: user.id, PostId: post2.id, RatingTypeId: ratingType2.id});
                    rating4 = await models.Rating.create({UserId: user.id, PostId: post3.id, RatingTypeId: ratingType.id});
                    rating5 = await models.Rating.create({UserId: user.id, PostId: post3.id, RatingTypeId: ratingType2.id});
                    rating6 = await models.Rating.create({UserId: user.id, PostId: post4.id, RatingTypeId: ratingType.id});
                    rating7 = await models.Rating.create({UserId: user.id, PostId: post4.id, RatingTypeId: ratingType2.id});
                    rating8 = await models.Rating.create({UserId: user.id, PostId: post5.id, RatingTypeId: ratingType.id});
                    rating9 = await models.Rating.create({UserId: user.id, PostId: post5.id, RatingTypeId: ratingType2.id});


                    done();
                });
            });
    });

    it('checking', (done) => {
        
        // console.log(JSON.stringify(convertedPosts, null, 2));
        done();

    });
});
