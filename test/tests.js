const assert = require('assert');
const slugify = require('slugify');
const models  = require('../models');
const queries = require('../controllers/queries');
const controllers = require('../controllers/controllers');
const pegjs = require('pegjs');

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
                    thread2, thread3, subCategory, subCategory2, subCategory3, subCategory4, subCategory5, category,
                    rating, rating1, rating2, rating3, rating4, rating5, rating6, rating7, rating8, rating9, result;
                    
                    user = await controllers.createUser('User 1');
                    category = await controllers.createCategory('Category 1');
                    subCategory = await controllers.createSubCategory('SubCategory 1', 'first subcategory', category.id);
                    subCategory2 = await controllers.createSubCategory('SubCategory 2', 'second subcategory', category.id);
                    subCategory3 = await controllers.createSubCategory('SubCategory 3', 'third subcategory', null, subCategory2.id);
                    subCategory4 = await controllers.createSubCategory('SubCategory 4', 'fourth subcategory', null, subCategory3.id);
                    subCategory5 = await controllers.createSubCategory('SubCategory 5', 'fifth subcategory', null, subCategory.id);
                    result = await controllers.createThread('Thread 1', 'content 1', user.id, subCategory.id);
                    thread = result[0];
                    post = result[1];
                    result = await controllers.createThread('Thread 2', 'content 2', user.id, subCategory.id);
                    thread2 = result[0];
                    post2 = result[1];
                    result = await controllers.createThread('Thread 3', 'content 3', user.id, subCategory5.id);
                    thread3 = result[0];
                    post3 = result[1];
                    post4 = await controllers.createPost('content 4', user.id, thread2.id);
                    post5 = await controllers.createPost('content 5', user.id, thread3.id);
                    ratingType = await controllers.createRatingType('Like');
                    ratingType2 = await controllers.createRatingType('Dislike');
                    rating = await controllers.createRating(user.id, post.id, ratingType.id);
                    rating1 = await controllers.createRating(user.id, post.id, ratingType2.id);
                    rating2 = await controllers.createRating(user.id, post2.id, ratingType.id);
                    rating3 = await controllers.createRating(user.id, post2.id, ratingType2.id);
                    rating4 = await controllers.createRating(user.id, post3.id, ratingType.id);
                    rating5 = await controllers.createRating(user.id, post3.id, ratingType2.id);
                    rating6 = await controllers.createRating(user.id, post4.id, ratingType.id);
                    rating7 = await controllers.createRating(user.id, post4.id, ratingType2.id);
                    rating8 = await controllers.createRating(user.id, post5.id, ratingType.id);
                    rating9 = await controllers.createRating(user.id, post5.id, ratingType2.id);


                    done();
                });
            });
    });

    it('pegjs stuff', (done) => {

        const parser = pegjs.generate(
        `start
        = bs:boldStructure {console.log('hit2'); return bs;}
        / is:italicizedStructure {console.log('hit3'); return is;}
        / string:string {console.log('here5'); return [{'content': string.join("")}];}
        
        boldStructure
        = left:(!'[b]' .)* '[b]' middle:boldContent '[/b]' right:start { console.log('here2'); return [{'content': left.map((el) => el.join("")).join("")} , {'bold': middle.map((el) => el.join("")).join("")}].concat(right); }
        
        italicizedStructure
        = left:(!'[i]' .)* '[i]' middle:italicizedContent '[/i]' right:start { console.log('here3'); return [{'content': left.map((el) => el.join("")).join("")} , {'italicized': middle.map((el) => el.join("")).join("")}].concat(right); }
        
        italicizedContent
        = (!'[/b]' !'[/i]' .)*
        / (!'[/i]' boldStructure)*
        
        boldContent
        = (!'[/b]' !'[/i]' .)*
        / (!'[/b]' italicizedStructure)*
        
        string
        = .*`
        );

        console.log(JSON.stringify(parser.parse("d[b]ffff[i]hh[/i]rrr[/b][i]rrr[/i]d"), null, 2))

        
        // let threadId = Number(1);
        // models.sequelize.query(queries.getThreadQuery(threadId), { type: models.Sequelize.QueryTypes.SELECT})
        // console.log(result2);
        
        done();

    });
});
