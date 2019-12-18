const assert = require('assert');
const slugify = require('slugify');
const models  = require('../models');
const queries = require('../controllers/queries');
const controllers = require('../controllers/controllers');
const parser = require('./parsetest');
const peg = require('pegjs');

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
 
    it('do the stuff', (done) => {
        models.sequelize.drop()
            .then(() => {
                models.sequelize.sync({force: true}).then( async () => {

                    // let user, ratingType, ratingType2, ratingType3, ratingType4, post, post2, post3, post4, thread, 
                    // thread2, thread3, subCategory, subCategory2, subCategory3, subCategory4, subCategory5, category,
                    // rating, rating1, rating2, rating3, rating4, rating5, rating6, rating7, rating8, rating9, result;
                    
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
                    // post4 = await controllers.createPost('content 4', user.id, thread2.id);
                    // post5 = await controllers.createPost('content 5', user.id, thread3.id);
                    let ratingType1 = await controllers.createRatingType('Love');
                    let ratingType2 = await controllers.createRatingType('Like');
                    let ratingType3 = await controllers.createRatingType('Dislike');
                    let ratingType4 = await controllers.createRatingType('Hate');
                    // rating = await controllers.createRating(user.id, post.id, ratingType.id);
                    // rating1 = await controllers.createRating(user.id, post.id, ratingType2.id);
                    // rating2 = await controllers.createRating(user.id, post2.id, ratingType.id);
                    // rating3 = await controllers.createRating(user.id, post2.id, ratingType2.id);
                    // rating4 = await controllers.createRating(user.id, post3.id, ratingType.id);
                    // rating5 = await controllers.createRating(user.id, post3.id, ratingType2.id);
                    // rating6 = await controllers.createRating(user.id, post4.newPost.id, ratingType.id);
                    // rating7 = await controllers.createRating(user.id, post4.newPost.id, ratingType2.id);
                    // rating8 = await controllers.createRating(user.id, post5.newPost.id, ratingType.id);
                    // rating9 = await controllers.createRating(user.id, post5.newPost.id, ratingType2.id);


                    done();
                });
            });
    });

    // it('parser stuff', (done) => {

    //     const tagStack = [];
    //     const tagNameStack = [];
    //     const positionStack = [];

    //     let tempTagStack = [];
    //     let tempTagNameStack = [];
    //     let tempPositionStack = [];

    //     let finalStructure = {};

    //     const tags = ['b','i'];
        
    //     //let text = "afbdd[b='adsfasdf']dsd[b]ad[i]sfadsf[/b]fb[sdfbd[/b]dddddd[dddd[b]ad[i]sfadsf[/b]ddd[d[d";

    //     //let text = "af[b]bdd[b=sdsdsd]dsd[b]ad[i]sfa[dsf[/b]fb[sdfbd[/b]ddddd[ddddd[b]ad[i]sfadsf[/b]dddd[d";

    //     let text = "[b<][/b]";

    //     const tag = new RegExp("\\[([/])?(" + tags.join("|") + ")([=][^\\]]*?)?\\]", "gi");
    //     const tag2 = new RegExp("\\[(" + tags.join("|") + ")([ =][^\\]]*?)?\\]([^\\[]*?)\\[/\\1\\]", "gi");

    //     text = text.replace(/</g, "&lt;"); // escape HTML tag brackets
    //     text = text.replace(/>/g, "&gt;"); // escape HTML tag brackets

    //     text = text.replace(tag, function(matched, isClosing, tagName, tagParams) {
    //         const params = tagParams || ''; // So we don't append 'undefined' to the replacement
    //         const closing = isClosing || ''; // So we don't append 'undefined' to the replacement
    //         return "<" + closing + tagName + params + ">";
    //     });

    //     text = text.replace(/\[/g, "&bad1;"); // escape ['s that aren't apart of tags
    //     text = text.replace(/\]/g, "&bad2;"); // escape ['s that aren't apart of tags
    //     text = text.replace(/</g, "["); // escape ['s that aren't apart of tags
    //     text = text.replace(/>/g, "]"); // escape ['s that aren't apart of tags

    //     let match = tag.exec(text);

    //     while(match !== null) {
    //         console.log(text)
    //         const [matched, isClosing, tagName, tagParams] = match;
    //         console.log(matched, isClosing, tagName, tagParams)
    //         console.log(tagStack)

    //         const params = tagParams || ''; // So we don't append 'undefined' to the replacement

    //         const findTag = (tag) => {
            
    //             const lastTag = tempTagStack.pop();
    //             const lastTagName = tempTagNameStack.pop();
    //             const lastPosition = tempPositionStack.pop();
    
    //             if (tag === lastTagName) {
    //                 tempTagStack.push(lastTag);
    //                 tempTagNameStack.push(lastTagName);
    //                 tempPositionStack.push(lastPosition);
    //                 return tempTagStack.length;
    //             } else if (tempTagStack.length === 0) {
    //                 return null;
    //             } else {
    //                 return findTag(tag);
    //             }
    //         };

    //         if (isClosing) {
    //             tempTagStack = [...tagStack];
    //             tempTagNameStack = [...tagNameStack];
    //             tempPositionStack = [...positionStack];
                
    //             let pos = findTag(tagName);

    //             console.log(pos)

    //             if (!pos) { // cant find closing tag in stack, eat it
    //                 const newString = "&bad1;" + tagName + params + "&bad2;";
    //                 console.log(tag.lastIndex)
    //                 console.log(newString.length)
    //                 text = text.substr(0, tag.lastIndex - newString.length + 10 - 1) + newString + text.substr(tag.lastIndex);
    //             } else {
    //                 const newString = "</" + tagName + params + ">";
    //                 text = text.substr(0, tag.lastIndex - newString.length) + newString + text.substr(tag.lastIndex);
    //                 let i = tagStack.length - pos;
    //                 while(i !== 0) { // if not at end of stack, remove the wrong ones
    //                     const lastTag = tagStack.pop();
    //                     const lastTagName = tagNameStack.pop();
    //                     const lastPosition = positionStack.pop();
    //                     const newString = "&bad1;" + lastTag.substr(1, lastTag.length - 2) + "&bad2;";
    //                     text = text.substr(0, lastPosition - lastTag.length) + newString + text.substr(lastPosition);
    //                     i--;
    //                 }
    //                 const lastTag = tagStack.pop();
    //                 const lastTagName = tagNameStack.pop();
    //                 const lastPosition = positionStack.pop();
    //             }

    //         } else {
    //             tagStack.push("<" + tagName + params + ">");
    //             tagNameStack.push(tagName);
    //             const newString = "<" + tagName + params + ">";
    //             text = text.substr(0, tag.lastIndex-newString.length) + newString + text.substr(tag.lastIndex );
    //             positionStack.push(tag.lastIndex);
    //         }

    //         tag.lastIndex = 0;
    //         match = tag.exec(text);
    //     }  

    //     let i = tagStack.length;
    //     while(i !== 0) { // if not at end of stack, remove the wrong ones
    //         const lastTag = tagStack.pop();
    //         const lastTagName = tagNameStack.pop();
    //         const lastPosition = positionStack.pop();
    //         const newString = "&bad1;" + lastTag.substr(1, lastTag.length - 2) + "&bad2;";
    //         //console.log(lastPosition);
    //         //console.log(lastTag.length);
    //         text = text.substr(0, lastPosition - lastTag.length) + newString + text.substr(lastPosition);
    //         i--;
    //     }

    //     text = text.replace(/</g, "["); // escape ['s that aren't apart of tags
    //     text = text.replace(/>/g, "]"); // escape ['s that aren't apart of tags


    //     const parser = peg.generate(
    //     `start =
    //     (Element / Text)*
        
    //     Element =
    //     "[" startTag:TagName tagAttribute:Attribute? "]" content:start "[/" endTag:TagName "]" {
    //         if (startTag != endTag) {
    //         throw new Error(
    //             "Expected [/" + startTag + "] but [/" + endTag + "] found."
    //         );
    //         }
        
    //         return {
    //         tag:    startTag,
    //         attribute: tagAttribute,
    //         content: content
    //         };
    //     }

    //     Attribute    
    //     = "=" chars:[^\\]]+  { return chars.join(""); }
        
    //     TagName = chars:[a-z]+ { return chars.join(""); }

    //     Text    = chars:[^[]+  { 
    //         let text = chars.join("");
    //         text = text.replace(/&bad1;/g, "[");
    //         text = text.replace(/&bad2;/g, "]");
    //         text = text.replace(/&lt;/g, "<");
    //         text = text.replace(/&gt;/g, ">");
    //         return text; 
    //     }`);

    //     console.log(text);

    //     //const tree = parser.parse(text);


        
    //     //console.log(JSON.stringify(tree, null, 2));    
    //     done();
        

    // });
});
