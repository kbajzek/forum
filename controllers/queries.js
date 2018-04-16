module.exports = {
    getCategoriesQuery() {
        return (
            `SELECT c.id   			as categoryId, 
                    c.name 			as categoryName,
                    s.id			as subCategoryId,
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
                                        ) as q2 on q2.categoryId = c.id and q2.subCategoryId = s.id
            ORDER BY categoryId, subCategoryId;`
        );
    },
    getSubCategoriesQuery(subcatid) {
        return (
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
                                        ) as q2 on q2.mainSubCategoryId = c.id and q2.subCategoryId = s.id
            ORDER BY subCategoryId;`
        );
    },
    getThreadsQuery(subcatid) {
        return (
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
                                        ) as q2 on q2.mainSubCategoryId = c.id and q2.threadId = t.id
            ORDER BY ThreadId;`
        );
    },
    getThreadQuery(threadqueryid) {
        return (
            `SELECT t.name			as threadName,
                    p.id			as postId,
                    p.content		as postContent,
                    r.ratingName	as ratingName,
                    r.ratingId		as ratingId,
                    r.userName		as ratingUserName,
                    r.userId		as ratingUserId,
                    u.id			as creatorId,
                    u.name			as creatorName,
                    qc.postCount	as postCount
                
            FROM (SELECT * FROM forum_test.threads as t WHERE t.id = ${threadqueryid}) as t
                    join forum_test.posts as p on p.ThreadId = t.id
                    join forum_test.users as u on p.UserId = u.id
                    join (
                        SELECT count(*) as postCount, p.UserId as userId
                        FROM forum_test.posts as p 
                        WHERE p.UserId in ( 
                                    SELECT u.id
                                    FROM (SELECT * FROM forum_test.threads as t WHERE t.id = ${threadqueryid}) as t
                                        join forum_test.posts as p on p.ThreadId = t.id
                                        join forum_test.users as u on p.UserId = u.id
                        )
                        GROUP BY p.UserId) as qc on qc.userId = u.id
                    left join (
                                SELECT rt.name		as ratingName,
                                    rt.id		as ratingId,
                                    u.name		as userName,
                                    u.id			as userId,
                                    r.PostId		as postId
                                FROM forum_test.ratings as r
                                            join forum_test.ratingtypes as rt on rt.id = r.RatingTypeId
                                            join forum_test.users as u on u.id = r.UserId
                                
                                ) as r on r.postId = p.id
            ORDER BY postId, ratingId;`
        );
    }
}