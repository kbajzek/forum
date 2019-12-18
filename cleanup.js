const models  = require('./models');
const controllers = require('./controllers/controllers');

models.sequelize.authenticate()
    .then(async () => {
        console.log('Connection has been established successfully.');

        await models.sequelize.drop();
        await models.sequelize.sync({force: true});
                    
        let user1 = await controllers.createUser('User 1', 'https://www.publicdomainpictures.net/pictures/40000/velka/question-mark.jpg');

        let category1 = await controllers.createCategory('News & Announcements');
        let subCategory1 = await controllers.createSubCategory('Announcements & News', 'Announcements & news related to this community.', category1.id);
        let subCategory2 = await controllers.createSubCategory('Important Information & Rules', 'Important Information & Rules are stored here.', category1.id);
        let subCategory3 = await controllers.createSubCategory('Changelog', 'Changelog & Updates are stored here.', category1.id);
        let category2 = await controllers.createCategory('Community Discussion');
        let subCategory4 = await controllers.createSubCategory('Introductions', 'Introduce yourself to the community here!', category2.id);
        let subCategory5 = await controllers.createSubCategory('General Discussion', 'Discussions about anything community related.', category2.id);
        let subCategory6 = await controllers.createSubCategory('Off-Topic', 'Any discussion not related to this community.', category2.id);
        let subCategory7 = await controllers.createSubCategory('Media', 'Share any media, screenshots, videos, etc. related to the community here.', category2.id);
        let category3 = await controllers.createCategory('Suggestions');
        let subCategory8 = await controllers.createSubCategory('Web & Forum Suggestions', 'Have a suggestion for the forums? Post it here!', category3.id);
        let subCategory9 = await controllers.createSubCategory('Community Suggestions', 'Have a suggestion for the communtity? Post it here!', category3.id);
        let category4 = await controllers.createCategory('Support & Administration');
        let subCategory10 = await controllers.createSubCategory('Tutorials', 'All user-created Tutorials are posted here to help and assist new members.', category4.id);
        let subCategory11 = await controllers.createSubCategory('Archived', 'Archived Announcements', null, subCategory1.id);
        let subCategory12 = await controllers.createSubCategory('Archived', 'Archived Rules', null, subCategory2.id);
        let subCategory13 = await controllers.createSubCategory('Archived', 'Archived Changelogs', null, subCategory3.id);
        let subCategory14 = await controllers.createSubCategory('Farewells', 'Leaving the community? Say your Goodbyes!', null, subCategory4.id);
        let subCategory15 = await controllers.createSubCategory('Approved', 'Approved Suggestions', null, subCategory8.id);
        let subCategory16 = await controllers.createSubCategory('Rejected', 'Rejected Suggestions', null, subCategory8.id);
        let subCategory17 = await controllers.createSubCategory('Approved', 'Approved Suggestions', null, subCategory9.id);
        let subCategory18 = await controllers.createSubCategory('Rejected', 'Rejected Suggestions', null, subCategory9.id);

        let result = await controllers.createThread('Welcome to the forums!', '[size=36][center]Welcome all [color=#0ff00f]new[/color] members to the forums![/center][/size]', user1.id, subCategory1.id);
        let thread1 = result[0];
        let post1 = result[1];
        result = await controllers.createThread('Rules of the Forums', 'First rule of the forums, [size=24]there are [color=#ff0000]no[/color] rules![/size]', user1.id, subCategory2.id);
        let thread2 = result[0];
        let post2 = result[1];
        result = await controllers.createThread('Changelog #1',
`[b][list=o]
[li]The forums have been created![/li]
[/list][/b]`,
        user1.id, subCategory3.id);
        let thread3 = result[0];
        let post3 = result[1];
        result = await controllers.createThread('My introduction!', '[center][b][size=30][color=#ff00ff]Hello community![/color][/size][/b][/center]', user1.id, subCategory4.id);
        let thread4 = result[0];
        let post4 = result[1];
        result = await controllers.createThread('My thoughts on the community.', '[code=javascript]What a nice community![/code]', user1.id, subCategory5.id);
        let thread5 = result[0];
        let post5 = result[1];
        result = await controllers.createThread('Lizards are green', 'They are [b][size=36]very[/size][/b] [size=24][color=#00ff00]green[/color][/size]!', user1.id, subCategory6.id);
        let thread6 = result[0];
        let post6 = result[1];
        result = await controllers.createThread('Strawberry', 
`[size=36][color=#826a1a][center]Here's a nice picture of a strawberry![/center][/color][/size]
[image]https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/PerfectStrawberry.jpg/220px-PerfectStrawberry.jpg[/image]`
        , user1.id, subCategory7.id);
        let thread7 = result[0];
        let post7 = result[1];
        result = await controllers.createThread('My good suggestion', '[color=#00ff00][size=24][center][b][u]Make a forum![/u][/b][/center][/size][/color]', user1.id, subCategory15.id);
        let thread8 = result[0];
        let post8 = result[1];
        result = await controllers.createThread('My bad suggestion', '[color=#ff0000][size=24][center][b][u]Dont make a forum![/u][/b][/center][/size][/color]', user1.id, subCategory16.id);
        let thread9 = result[0];
        let post9 = result[1];
        result = await controllers.createThread('My great suggestion', '[color=#00ff00][size=24][center][b][u]Make a community![/u][/b][/center][/size][/color]', user1.id, subCategory17.id);
        let thread10 = result[0];
        let post10 = result[1];
        result = await controllers.createThread('My controversial suggestion', '[color=#ff0000][size=24][center][b][u]Dont make a community![/u][/b][/center][/size][/color]', user1.id, subCategory18.id);
        let thread11 = result[0];
        let post11 = result[1];
        result = await controllers.createThread('Forum Buttons', '[color=#00ff00][size=24][center][b][u]Make the default buttons prettier![/u][/b][/center][/size][/color]', user1.id, subCategory8.id);
        let thread12 = result[0];
        let post12 = result[1];
        result = await controllers.createThread('bigger community', '[color=#00ff00][size=24][center][b][u]Grow the community![/u][/b][/center][/size][/color]', user1.id, subCategory9.id);
        let thread13 = result[0];
        let post13 = result[1];

        let ratingType1 = await controllers.createRatingType('Love');
        let ratingType2 = await controllers.createRatingType('Like');
        let ratingType3 = await controllers.createRatingType('Dislike');
        let ratingType4 = await controllers.createRatingType('Hate');

        await models.sequelize.close();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });