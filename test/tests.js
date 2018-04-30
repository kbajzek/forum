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

                    let user, ratingType, ratingType2, ratingType3, ratingType4, post, post2, post3, post4, thread, 
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
                    ratingType = await controllers.createRatingType('Love');
                    ratingType2 = await controllers.createRatingType('Like');
                    ratingType3 = await controllers.createRatingType('Dislike');
                    ratingType4 = await controllers.createRatingType('Hate');
                    rating = await controllers.createRating(user.id, post.id, ratingType.id);
                    rating1 = await controllers.createRating(user.id, post.id, ratingType2.id);
                    rating2 = await controllers.createRating(user.id, post2.id, ratingType.id);
                    rating3 = await controllers.createRating(user.id, post2.id, ratingType2.id);
                    rating4 = await controllers.createRating(user.id, post3.id, ratingType.id);
                    rating5 = await controllers.createRating(user.id, post3.id, ratingType2.id);
                    rating6 = await controllers.createRating(user.id, post4.newPost.id, ratingType.id);
                    rating7 = await controllers.createRating(user.id, post4.newPost.id, ratingType2.id);
                    rating8 = await controllers.createRating(user.id, post5.newPost.id, ratingType.id);
                    rating9 = await controllers.createRating(user.id, post5.newPost.id, ratingType2.id);


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
