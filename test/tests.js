const assert = require('assert');
const seq = require('sequelize');

describe('Tests', () => {

    let sequelize;

    before((done) => {
        sequelize = new seq('forum_test', 'root', 'password', {
            dialect: 'mysql',
        });
        sequelize
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

        const RatingType = sequelize.define('RatingType', {

            name: {
                type: seq.STRING
            }

        });

        const Rating = sequelize.define('Rating', {

            id: {
                type: seq.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            }

        }); 

        const User = sequelize.define('User', {

            name: {
                type: seq.STRING
            }

        });

        const Post = sequelize.define('Post', {
            
            content: {
                type: seq.TEXT
            },
            
        });

        const Thread = sequelize.define('Thread', {

            name: {
                type: seq.STRING
            },
            total_views: {
                type: seq.INTEGER
            }    
        });

        const SubCategory = sequelize.define('SubCategory', {

            name: {
                type: seq.STRING
            },
            description: {
                type: seq.STRING
            },
            ancestors: {
                type: seq.STRING
            }
        });

        const Category = sequelize.define('Category', {

            name: {
                type: seq.STRING
            }  
            
        });  

        Rating.belongsTo(User);
        Rating.belongsTo(Post);
        Rating.belongsTo(RatingType);

        Post.belongsTo(User);
        Post.belongsTo(Thread);

        Thread.belongsTo(SubCategory);

        SubCategory.belongsTo(SubCategory); 
        SubCategory.belongsTo(Category);

        sequelize.drop()
            .then(() => {
                sequelize.sync({force: true}).then( async () => {

                    let user, ratingType, ratingType2, post, post2, post3, post4, thread, 
                    thread2, subCategory, subCategory2, subCategory3, subCategory4, subCategory5, category,
                    rating, rating1, rating2, rating3, rating4, rating5, rating6, rating7, rating8, rating9;
                    
                    user = await User.create({name: 'User 1'});
                    ratingType
                    category = await Category.create({name: 'Category 1'});
                    subCategory = await SubCategory.create({name: 'SubCategory 1', description: 'first subcategory', CategoryId: category.id});
                    subCategory2 = await SubCategory.create({name: 'SubCategory 2', description: 'second subcategory', CategoryId: category.id});
                    subCategory3 = await SubCategory.create({name: 'SubCategory 3', description: 'third subcategory', SubCategoryId: subCategory2.id, ancestors: '2'});
                    subCategory4 = await SubCategory.create({name: 'SubCategory 4', description: 'fourth subcategory', SubCategoryId: subCategory3.id, ancestors: '3,2'});
                    subCategory5 = await SubCategory.create({name: 'SubCategory 5', description: 'fifth subcategory', SubCategoryId: subCategory.id, ancestors: '1'});
                    thread = await Thread.create({name: 'Thread 1', SubCategoryId: subCategory.id});
                    thread2 = await Thread.create({name: 'Thread 2', SubCategoryId: subCategory.id});
                    thread3 = await Thread.create({name: 'Thread 3', SubCategoryId: subCategory5.id});
                    post = await Post.create({content: 'content 1', UserId: user.id, ThreadId: thread.id});
                    post2 = await Post.create({content: 'content 2', UserId: user.id, ThreadId: thread.id});
                    post3 = await Post.create({content: 'content 3', UserId: user.id, ThreadId: thread2.id});
                    post4 = await Post.create({content: 'content 4', UserId: user.id, ThreadId: thread2.id});
                    post5 = await Post.create({content: 'content 5', UserId: user.id, ThreadId: thread3.id});
                    ratingType = await RatingType.create({name: 'Like'});
                    ratingType2 = await RatingType.create({name: 'Dislike'});
                    rating = await Rating.create({UserId: user.id, PostId: post.id, RatingTypeId: ratingType.id});
                    rating1 = await Rating.create({UserId: user.id, PostId: post.id, RatingTypeId: ratingType2.id});
                    rating2 = await Rating.create({UserId: user.id, PostId: post2.id, RatingTypeId: ratingType.id});
                    rating3 = await Rating.create({UserId: user.id, PostId: post2.id, RatingTypeId: ratingType2.id});
                    rating4 = await Rating.create({UserId: user.id, PostId: post3.id, RatingTypeId: ratingType.id});
                    rating5 = await Rating.create({UserId: user.id, PostId: post3.id, RatingTypeId: ratingType2.id});
                    rating6 = await Rating.create({UserId: user.id, PostId: post4.id, RatingTypeId: ratingType.id});
                    rating7 = await Rating.create({UserId: user.id, PostId: post4.id, RatingTypeId: ratingType2.id});
                    rating8 = await Rating.create({UserId: user.id, PostId: post5.id, RatingTypeId: ratingType.id});
                    rating9 = await Rating.create({UserId: user.id, PostId: post5.id, RatingTypeId: ratingType2.id});


                    done();
                });
            });
    });

    it('checking', (done) => {

        const query = 
`SELECT c.id   			as categoryId, 
        c.name 			as categoryName,
        s.id				as subCategoryId,
        s.name			as subCategoryName,
        s.description	as description,
        q2.totalPosts	as totalPosts,
        q2.maxDate		as maxDate,
        q2.threadName	as ThreadName,
        q2.threadId		as ThreadId,
        q2.userName		as UserName,
        q2.userId		as UserId,
        q2.postId		as postId
        
 FROM forum_test.categories as c
         join forum_test.subcategories as s on s.CategoryId = c.id
         left join (SELECT 	q1.categoryId as categoryId, 
                             q1.subCategoryId as subCategoryId, 
                             q1.totalPosts as totalPosts, 
                             q1.maxDate as maxDate, 
                             t.name as threadName, 
                             t.id as threadId, 
                             u.name as userName, 
                             u.id as userId,
                             p.id as postId
                        FROM forum_test.categories as c
                             join forum_test.subcategories 	as s 	on s.CategoryId = c.id
                             join forum_test.subcategories 	as s2 	on ((s2.ancestors like CONCAT("%", s.id, "%")) or s.id = s2.id)
                             join forum_test.threads			as t 	on t.SubCategoryId = s2.id
                             join forum_test.posts			as p 	on p.ThreadId = t.id
                             join forum_test.users			as u 	on p.UserId = u.id
                             join (
                                 SELECT  c.id as categoryId,
                                         s.id as subCategoryId,
                                         count(*) as totalPosts,
                                         max(p.updatedAt) as maxDate
                                 FROM 	forum_test.categories as c
                                         join forum_test.subcategories as s on s.CategoryId = c.id
                                         join forum_test.subcategories as s2 on ((s2.ancestors like CONCAT("%", s.id, "%")) or s.id = s2.id)
                                         join forum_test.threads as t on t.SubCategoryId = s2.id
                                         join forum_test.posts as p on p.ThreadId = t.id
                                 GROUP BY categoryId, subCategoryId) as q1 on c.id = q1.categoryId and s.id = q1.subCategoryId and p.updatedAt = q1.maxDate 
                            GROUP BY subCategoryId
                             ) as q2 on q2.categoryId = c.id and q2.subCategoryId = s.id;`;
        
        const subcatid = 1;
        const query2 = 
`SELECT c.id   			as mainSubCategoryId, 
        c.name 			as mainSubCategoryName,
        s.id				as subCategoryId,
        s.name			as subCategoryName,
        s.description	as description,
        q2.totalPosts	as totalPosts,
        q2.maxDate		as maxDate,
        q2.threadName	as ThreadName,
        q2.threadId		as ThreadId,
        q2.userName		as UserName,
        q2.userId		as UserId,
        q2.postId		as postId
        
 FROM (SELECT * FROM forum_test.subcategories as c WHERE c.id = ${subcatid}) as c
         join forum_test.subcategories as s on s.SubCategoryId = c.id
         left join (SELECT 	q1.mainSubCategoryId as mainSubCategoryId, 
                             q1.subCategoryId as subCategoryId, 
                             q1.totalPosts as totalPosts, 
                             q1.maxDate as maxDate, 
                             t.name as threadName, 
                             t.id as threadId, 
                             u.name as userName, 
                             u.id as userId,
                             p.id as postId
                        FROM forum_test.subcategories as c
                             join forum_test.subcategories 	as s 	on s.SubCategoryId = c.id
                             join forum_test.subcategories 	as s2 	on ((s2.ancestors like CONCAT("%", s.id, "%")) or s.id = s2.id)
                             join forum_test.threads			as t 	on t.SubCategoryId = s2.id
                             join forum_test.posts			as p 	on p.ThreadId = t.id
                             join forum_test.users			as u 	on p.UserId = u.id
                             join (
                                 SELECT  c.id as mainSubCategoryId,
                                         s.id as subCategoryId,
                                         count(*) as totalPosts,
                                         max(p.updatedAt) as maxDate
                                 FROM 	(SELECT * FROM forum_test.subcategories as c WHERE c.id = ${subcatid}) as c
                                         join forum_test.subcategories as s on s.SubCategoryId = c.id
                                         join forum_test.subcategories as s2 on ((s2.ancestors like CONCAT("%", s.id, "%")) or s.id = s2.id)
                                         join forum_test.threads as t on t.SubCategoryId = s2.id
                                         join forum_test.posts as p on p.ThreadId = t.id
                                 GROUP BY mainSubCategoryId, subCategoryId) as q1 on c.id = q1.mainSubCategoryId and s.id = q1.subCategoryId and p.updatedAt = q1.maxDate 
                            GROUP BY subCategoryId
                             ) as q2 on q2.mainSubCategoryId = c.id and q2.subCategoryId = s.id;`;


        const query3 = 
`SELECT c.id   			as mainSubCategoryId, 
        c.name 			as mainSubCategoryName,
        t.id				as ThreadId,
        t.name			as ThreadName,
        q2.totalPosts	as totalPosts,
        q2.maxDate		as maxDate,
        q2.userName		as UserName,
        q2.userId		as UserId,
        q2.postId		as postId
        
 FROM (SELECT * FROM forum_test.subcategories as c WHERE c.id = ${subcatid}) as c
         join forum_test.threads as t on t.SubCategoryId = c.id
         join (SELECT 	q1.mainSubCategoryId as mainSubCategoryId, 
                             q1.threadId as threadId, 
                             q1.totalPosts as totalPosts, 
                             q1.maxDate as maxDate, 
                             t.name as threadName,
                             u.name as userName, 
                             u.id as userId,
                             p.id as postId
                        FROM forum_test.subcategories as c
                             join forum_test.threads			as t 	on t.SubCategoryId = c.id
                             join forum_test.posts			as p 	on p.ThreadId = t.id
                             join forum_test.users			as u 	on p.UserId = u.id
                             join (
                                 SELECT  c.id as mainSubCategoryId,
                                         t.id as threadId,
                                         count(*) as totalPosts,
                                         max(p.updatedAt) as maxDate
                                 FROM 	(SELECT * FROM forum_test.subcategories as c WHERE c.id = ${subcatid}) as c
                                         join forum_test.threads as t on t.SubCategoryId = c.id
                                         join forum_test.posts as p on p.ThreadId = t.id
                                 GROUP BY mainSubCategoryId, threadId) as q1 on c.id = q1.mainSubCategoryId and t.id = q1.threadId and p.updatedAt = q1.maxDate 
                         GROUP BY threadId
                             ) as q2 on q2.mainSubCategoryId = c.id and q2.threadId = t.id;`

        const threadqueryid = 1;
        const query4 = 
`SELECT 	t.name			as threadName,
		p.id			as postId,
        p.content		as postContent,
        r.ratingName	as ratingName,
        r.ratingId		as ratingId,
        r.userName		as ratingUserName,
        r.userId		as ratingUserId,
        u.id			as creatorId,
        u.name			as creatorName
       
FROM (SELECT * FROM forum_test.threads as t WHERE t.id = ${threadqueryid}) as t
		join forum_test.posts as p on p.ThreadId = t.id
        join forum_test.users as u on p.UserId = u.id
        left join (
					SELECT rt.name		as ratingName,
						   rt.id		as ratingId,
                           u.name		as userName,
                           u.id			as userId,
                           r.PostId		as postId
                    FROM forum_test.ratings as r
								join forum_test.ratingtypes as rt on rt.id = r.RatingTypeId
                                join forum_test.users as u on u.id = r.UserId
                    
                    ) as r on r.postId = p.id;`

        sequelize.query(query, { type: seq.QueryTypes.SELECT})
            .then(users => {
                console.log(users);
                done();
            });





        // const Category = mongoose.model('Category');
        // let category_ex;
        // Category.find({})
        // .populate({
        //     path: 'subCategories',
        //     select: 'name description lastPost postCount subCategoryId -_id',
        //     populate: {
        //         path: 'lastPost',
        //         select: 'createdOn creator parentThread -_id',
        //         populate: {
        //             path: 'parentThread creator',
        //             select: 'name threadId -_id'
        //         }
        //     }
        // })
        // .lean()
        // .then((categories) => {
        //     const filledCategories = categories.map((category) => {
        //         const filledSubCategories = category.subCategories.map((subCategory) => {
        //             const { subCategoryId, postCount, lastPost, ...rest} = subCategory;
        //             const path = `/${subCategoryId}/${slugify(subCategory.name).toLowerCase()}`;

        //             let lastUpdated = 'none';
        //             let lastThreadName = 'none';
        //             let lastUser = 'none';
        //             let lastActiveThreadPath = 'none';

        //             if (subCategory.lastPost) {
        //                 lastUpdated = subCategory.lastPost.createdOn;
        //                 lastThreadName = subCategory.lastPost.parentThread.name;
        //                 lastUser = subCategory.lastPost.creator.name;
        //                 lastActiveThreadPath = `/thread/${subCategory.lastPost.parentThread.threadId}/${slugify(lastThreadName).toLowerCase()}`;
        //             }
                    
        //             const lastActiveThread = {
        //                 name: lastThreadName,
        //                 user: lastUser,
        //                 lastUpdated,
        //                 path: lastActiveThreadPath
        //             };

        //             return {
        //                 id: subCategory.subCategoryId,
        //                 path,
        //                 ...rest,
        //                 totalPosts: subCategory.postCount,
        //                 lastActiveThread
        //             }
        //         });
        //         const { _id, __v, categoryId, subCategories, ...rest} = category;
        //         return {
        //             ...rest,
        //             id: category.categoryId,
        //             subCategories: filledSubCategories
        //         }
        //     });
        //     res.send(filledCategories);
        // });



    });


//   let user, post, post2, post3, post4, thread, thread2, subCategory, subCategory2, subCategory3, subCategory4, subCategory5, category;

//   beforeEach(async (done) => {
//     category = await forumController.createCategory('Category 1');
//     subCategory = await forumController.createSubCategory('SubCategory 1', 'first subcategory', category);
//     subCategory2 = await forumController.createSubCategory('SubCategory 2', 'second subcategory', category);
//     subCategory3 = await forumController.createSubCategory('SubCategory 3', 'third subcategory', null, subCategory2);
//     subCategory4 = await forumController.createSubCategory('SubCategory 4', 'fourth subcategory', null, subCategory2);
//     subCategory5 = await forumController.createSubCategory('SubCategory 5', 'fifth subcategory', null, subCategory);
//     thread, post = await forumController.createThread('Thread 1', parentSubCategory, creator, createdOn, content);
//     thread = new Thread({ name: 'Thread 1' });
//     thread2 = new Thread({ name: 'Thread 2' });
//     thread3 = new Thread({ name: 'Thread 3' });
//     post = new Post({createdOn: Date.now(), content: '1' });
//     post2 = new Post({createdOn: Date.now(), content: '2'});
//     post3 = new Post({createdOn: Date.now(), content: '3'});
//     post4 = new Post({createdOn: Date.now(), content: '4'});
//     post5 = new Post({createdOn: Date.now(), content: '5'});
//     user = new User({name: 'user 1'});

//     const ratings = [
//         {
//             name: 'like'
//         },
//         {
//             name: 'dislike'
//         }
//     ];

    


//     post.creator = user;
//     post2.creator = user;
//     post3.creator = user;
//     post4.creator = user;
//     post5.creator = user;

//     post.ratings = ratings;
//     post2.ratings = ratings;
//     post3.ratings = ratings;
//     post4.ratings = ratings;
//     post5.ratings = ratings;

//     post.ratings[0].users.push(user);
//     post2.ratings[0].users.push(user);
//     post3.ratings[0].users.push(user);
//     post4.ratings[0].users.push(user);
//     post5.ratings[0].users.push(user);
//     post.ratings[1].users.push(user);
//     post2.ratings[1].users.push(user);
//     post3.ratings[1].users.push(user);
//     post4.ratings[1].users.push(user);
//     post5.ratings[1].users.push(user);

 
//     subCategory.threads.push(thread);
//     thread.parentSubCategory = subCategory;

//     subCategory.threads.push(thread2);
//     thread2.parentSubCategory = subCategory;

//     subCategory5.threads.push(thread3);
//     thread3.parentSubCategory = subCategory5;


//     thread.posts.push(post);
//     thread.creator = post.creator;
//     thread.createdOn = post.createdOn;
//     thread.lastPost = post;
//     post.parentThread = thread;
//     thread.parentSubCategory.postCount += 1;
//     thread.parentSubCategory.lastPost = post;
//     thread.parentSubCategory.ancestors.forEach((ancestor) => {
//         ancestor.postCount += 1;
//         ancestor.lastPost = post;
//     })

//     thread.posts.push(post2);
//     thread.lastPost = post2;
//     post2.parentThread = thread;
//     thread.parentSubCategory.postCount += 1;
//     thread.parentSubCategory.lastPost = post2;
//     thread.parentSubCategory.ancestors.forEach((ancestor) => {
//         ancestor.postCount += 1;
//         ancestor.lastPost = post2;
//     })

//     thread2.posts.push(post3);
//     thread2.creator = post3.creator;
//     thread2.createdOn = post3.createdOn;
//     thread2.lastPost = post3;
//     post3.parentThread = thread2;
//     thread2.parentSubCategory.postCount += 1;
//     thread2.parentSubCategory.lastPost = post3;
//     thread2.parentSubCategory.ancestors.forEach((ancestor) => {
//         ancestor.postCount += 1;
//         ancestor.lastPost = post3;
//     })

//     thread2.posts.push(post4);
//     post4.parentThread = thread2;
//     thread2.lastPost = post4;
//     thread2.parentSubCategory.postCount += 1;
//     thread2.parentSubCategory.lastPost = post4;
//     thread2.parentSubCategory.ancestors.forEach((ancestor) => {
//         ancestor.postCount += 1;
//         ancestor.lastPost = post4;
//     })

//     thread3.posts.push(post5);
//     thread3.creator = post5.creator;
//     thread3.createdOn = post5.createdOn;
//     thread3.lastPost = post5;
//     post5.parentThread = thread3;
//     thread3.parentSubCategory.postCount += 1;
//     thread3.parentSubCategory.lastPost = post5;
//     thread3.parentSubCategory.ancestors.forEach((ancestor) => {
//         ancestor.postCount += 1;
//         ancestor.lastPost = post5;
//     })

//     Promise.all([user.save(), category.save(), subCategory.save(), thread.save(), post.save()])
//       .then(() => {
//         Promise.all([
//                         subCategory2.save(), 
//                         subCategory3.save(), 
//                         subCategory4.save(), 
//                         subCategory5.save(),
//                         thread2.save(),
//                         thread3.save(), 
//                         post2.save(), 
//                         post3.save(), 
//                         post4.save(), 
//                         post5.save()])  
//           .then(() => done());
//       });
//   });

  // it('saves a relation between a category and subCategory', (done) => {
  //   Category.findOne({ name: 'Category 1' })
  //     .populate('subCategories')
  //     .then((category) => {
  //       assert(category.subCategories[0].name === 'SubCategory 1');
  //       done();
  //     });
  // });

  // it('saves a full relation graph', (done) => {
  //   Category.findOne({ name: 'Category 1' })
  //     .populate({
  //       path: 'subCategories',
  //       populate: {
  //         path: 'threads',
  //         model: 'Thread',
  //         populate: {
  //           path: 'posts',
  //           model: 'Post'
  //         }
  //       }
  //     })
  //     .then((category) => {
  //       assert(category.name === 'Category 1');
  //       assert(category.subCategories[0].name === 'SubCategory 1');
  //       assert(category.subCategories[0].threads[0].name === 'Thread 1');
  //       assert(category.subCategories[0].threads[0].posts[0].content === '1');
  //       //console.log(JSON.stringify(category, null, 2));
  //       done();
  //     });
  // });

  // it('just checking', (done) => {
  //   done();
            
  // });
});
