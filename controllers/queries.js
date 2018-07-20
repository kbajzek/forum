module.exports = {
    getCategoriesQuery() {
        return (
            `SELECT c.id   			as categoryId, 
                    c.name 			as categoryName,
                    c.position      as categoryPosition,
                    s.id			as subCategoryId,
                    s.name			as subCategoryName,
                    s.position      as subCategoryPosition,
                    s.description	as description,
                    q2.totalPosts	as totalPosts,
                    q2.maxDate		as maxDate,
                    q2.threadName	as ThreadName,
                    q2.threadId		as ThreadId,
                    q2.userName		as UserName,
                    q2.userId		as UserId,
                    q2.postId		as postId
                    
            FROM forum_test.categories as c
                    left join forum_test.subcategories as s on s.CategoryId = c.id
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
                                        join forum_test.subcategories 	as s2 	on ((s2.ancestors like CONCAT("%/", s.id, "/%")) or s.id = s2.id)
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
                                                    join forum_test.subcategories as s2 on ((s2.ancestors like CONCAT("%/", s.id, "/%")) or s.id = s2.id)
                                                    join forum_test.threads as t on t.SubCategoryId = s2.id
                                                    join forum_test.posts as p on p.ThreadId = t.id
                                            GROUP BY categoryId, subCategoryId) as q1 on c.id = q1.categoryId and s.id = q1.subCategoryId and p.updatedAt = q1.maxDate 
                                        GROUP BY subCategoryId
                                        ) as q2 on q2.categoryId = c.id and q2.subCategoryId = s.id
            ORDER BY categoryPosition, subCategoryPosition;`
        );
    },
    getSubCategoriesQuery(subcatid) {
        return (
            `SELECT c.id   			as mainSubCategoryId, 
                    c.name 			as mainSubCategoryName,
                    s.id			as subCategoryId,
                    s.name			as subCategoryName,
                    s.position      as subCategoryPosition,
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
                                    FROM (SELECT * FROM forum_test.subcategories as c WHERE c.id = ${subcatid}) as c
                                        join forum_test.subcategories 	as s 	on s.SubCategoryId = c.id
                                        join forum_test.subcategories 	as s2 	on ((s2.ancestors like CONCAT("%/", s.id, "/%")) or s.id = s2.id)
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
                                                    join forum_test.subcategories as s2 on ((s2.ancestors like CONCAT("%/", s.id, "/%")) or s.id = s2.id)
                                                    join forum_test.threads as t on t.SubCategoryId = s2.id
                                                    join forum_test.posts as p on p.ThreadId = t.id
                                            GROUP BY mainSubCategoryId, subCategoryId) as q1 on c.id = q1.mainSubCategoryId and s.id = q1.subCategoryId and p.updatedAt = q1.maxDate 
                                        GROUP BY subCategoryId
                                        ) as q2 on q2.mainSubCategoryId = c.id and q2.subCategoryId = s.id
            ORDER BY subCategoryPosition;`
        );
    },
    getThreadsQuery(subcatid) {
        return (
            `SELECT q1.mainSubCategoryId as mainSubCategoryId,
                    c.name as mainSubCategoryName, 
                    t.id as ThreadId,
                    t.name as ThreadName, 
                    t.createdAt as ThreadMade,
                    q1.totalPosts as totalPosts, 
                    q1.maxDate as maxDate, 
                    t.name as threadName,
                    u.name as userName, 
                    u.id as userId,
                    p.id as postId,
                    u2.id as creatorId,
                    u2.name as creatorName
            FROM    (SELECT * FROM forum_test.subcategories as c WHERE c.id = ${subcatid}) as c
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
                    join forum_test.posts			as p2	on p2.ThreadId = t.id and p2.position = 1
                    join forum_test.users			as u2	on p2.UserId = u2.id
            GROUP BY threadId
            ORDER BY maxDate DESC;`
        );
    },
    getThreadQuery(threadqueryid) {
        return (
            `SELECT t.name			as threadName,
                    t.id            as threadId,
                    p.id			as postId,
                    p.content		as postContent,
                    r.ratingName	as ratingName,
                    r.ratingTypeId	as ratingTypeId,
                    r.ratingId      as ratingId,
                    r.userName		as ratingUserName,
                    r.userId		as ratingUserId,
                    u.id			as creatorId,
                    u.name			as creatorName,
                    qc.postCount	as postCount,
                    p.position      as postPosition
                
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
                                    rt.id		as ratingTypeId,
                                    r.id        as ratingId,
                                    u.name		as userName,
                                    u.id			as userId,
                                    r.PostId		as postId
                                FROM forum_test.ratings as r
                                            join forum_test.ratingtypes as rt on rt.id = r.RatingTypeId
                                            join forum_test.users as u on u.id = r.UserId
                                
                                ) as r on r.postId = p.id
            ORDER BY postPosition, ratingTypeId;`
        );
    },
    getUserQuery(userqueryid) {
        return (
            `SELECT p.id		as postId,
                p.content		as postContent,
                p.createdAt		as postCreatedAt,
                p.ThreadId		as postThreadId,
                p.position		as postPosition,
                t.name			as threadName,
                u.name          as userName
            FROM forum_test.posts as p
                join forum_test.threads as t on t.id = p.ThreadId
                join forum_test.users as u on u.id = ${userqueryid}
            WHERE p.userId = ${userqueryid}
            ORDER BY postCreatedAt desc;`
        );
    },
    getUserMessageListQuery(userid) {
        return (
            `SELECT m.id		as messageId,
                m.name  		as messageName,
                m.createdAt		as messageCreatedAt
            FROM forum_test.messages as m
                join forum_test.messagemembers as mm on mm.MessageId = m.id
            WHERE mm.UserId = ${userid}
            ORDER BY messageCreatedAt desc;`
        );
    },
    getMessageQuery(messageid) {
        return (
            `SELECT mp.id		as messagePostId,
                mp.content 		as messagePostContent,
                mp.createdAt    as messagePostCreatedAt,
                u.name          as messageCreatorName,
                u.id            as messageCreatorId,
                qc.postCount	as messageCreatorPostCount,
                m.name          as messageName
            FROM forum_test.messages as m
                join forum_test.messageposts as mp on mp.MessageId = m.id
                left join forum_test.users as u on mp.UserId = u.id
                join (
                    SELECT count(*) as postCount, p.UserId as userId
                    FROM forum_test.posts as p 
                    WHERE p.UserId in ( 
                                SELECT u.id
                                FROM (SELECT * FROM forum_test.messageposts as mp WHERE mp.MessageId = ${messageid}) as mp
                                    join forum_test.users as u on mp.UserId = u.id
                    )
                    GROUP BY p.UserId) as qc on qc.userId = u.id
            WHERE m.id = ${messageid}
            ORDER BY messagePostCreatedAt;`
        );
    },
    getMessageMembersQuery(messageid) {
        return (
            `SELECT u.id		as userId,
                u.name 		    as userName,
                mm.id           as memberId,
                mm.permission   as memberPermission
            FROM forum_test.messagemembers as mm
                join forum_test.users as u on mm.UserId = u.id
            WHERE mm.MessageId = ${messageid}
            ORDER BY memberPermission DESC, userName ASC;`
        );
    }
}