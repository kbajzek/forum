module.exports = {
    getCategoriesQuery() {
        return (
            `SELECT c.id   			as categoryId, 
                    c.name 			as categoryName,
                    c.position      as categoryPosition,
                    s.id			as subcategoryId,
                    s.name			as subCategoryName,
                    s.position      as subCategoryPosition,
                    s.description	as description,
                    q3.totalPosts	as totalPosts,
                    q3.maxDate		as maxDate,
                    q3.threadName	as ThreadName,
                    q3.threadId		as threadId,
                    q3.userName		as UserName,
                    q3.userId		as userId,
                    q3.postId		as postId
            FROM forum_test.categories as c
            left join forum_test.subcategories as s on s.categoryId = c.id
            left join ( SELECT	q1.categoryId as categoryId,
                                q1.subcategoryId as subcategoryId,
                                q1.totalPosts as totalPosts,
                                q1.maxDate as maxDate,
                                q2.threadId as threadId,
                                q2.threadName as threadName,
                                q2.userId as userId,
                                q2.userName as userName,
                                q2.postId as postId
                        FROM (SELECT    c.id as categoryId,
                                        s.id as subcategoryId,
                                        count(*) as totalPosts,
                                        max(p.updatedAt) as maxDate
                                FROM 	forum_test.categories as c
                                        join forum_test.subcategories as s on s.categoryId = c.id
                                        join forum_test.subcategories as s2 on ((s2.ancestors like CONCAT("%/", s.id, "/%")) or s.id = s2.id)
                                        join forum_test.threads as t on t.subcategoryId = s2.id
                                        join forum_test.posts as p on p.threadId = t.id
                                GROUP BY categoryId, subcategoryId
                            ) as q1
                        join (  SELECT  c.id as categoryId,
                                        s.id as subcategoryId,
                                        t.id as threadId,
                                        t.name as threadName,
                                        u.id as userId,
                                        u.name as userName,
                                        p.updatedAt as postDate,
                                        max(p.id) as postId
                                FROM 	forum_test.categories as c
                                        join forum_test.subcategories as s on s.categoryId = c.id
                                        join forum_test.subcategories as s2 on ((s2.ancestors like CONCAT("%/", s.id, "/%")) or s.id = s2.id)
                                        join forum_test.threads as t on t.subcategoryId = s2.id
                                        join forum_test.posts as p on p.threadId = t.id
                                        join forum_test.users as u on p.userId = u.id
                                GROUP BY categoryId, subcategoryId
                            ) as q2 on q1.categoryId = q2.categoryId and q1.subcategoryId = q2.subcategoryId and q1.maxDate = q2.postDate
                        ) as q3 on q3.categoryId = c.id and q3.subcategoryId = s.id
            ORDER BY categoryPosition, subCategoryPosition;`
        );
    },
    getSubCategoriesQuery(subcatid) {
        return (
            `SELECT c.id   			as mainsubcategoryId, 
                    c.name 			as mainSubCategoryName,
                    s.id			as subcategoryId,
                    s.name			as subCategoryName,
                    s.position      as subCategoryPosition,
                    s.description	as description,
                    q3.totalPosts	as totalPosts,
                    q3.maxDate		as maxDate,
                    q3.threadName	as ThreadName,
                    q3.threadId		as threadId,
                    q3.userName		as UserName,
                    q3.userId		as userId,
                    q3.postId		as postId
            FROM (SELECT * FROM forum_test.subcategories as c WHERE c.id = ${subcatid}) as c
            join forum_test.subcategories as s on s.subcategoryId = c.id
            left join ( SELECT	q1.mainsubcategoryId as mainsubcategoryId,
                                q1.subcategoryId as subcategoryId,
                                q1.totalPosts as totalPosts,
                                q1.maxDate as maxDate,
                                q2.threadId as threadId,
                                q2.threadName as threadName,
                                q2.userId as userId,
                                q2.userName as userName,
                                q2.postId as postId
                        FROM (SELECT    c.id as mainsubcategoryId,
                                        s.id as subcategoryId,
                                        count(*) as totalPosts,
                                        max(p.updatedAt) as maxDate
                                FROM 	(SELECT * FROM forum_test.subcategories as c WHERE c.id = ${subcatid}) as c
                                        join forum_test.subcategories as s on s.subcategoryId = c.id
                                        join forum_test.subcategories as s2 on ((s2.ancestors like CONCAT("%/", s.id, "/%")) or s.id = s2.id)
                                        join forum_test.threads as t on t.subcategoryId = s2.id
                                        join forum_test.posts as p on p.threadId = t.id
                                GROUP BY mainsubcategoryId, subcategoryId
                            ) as q1
                        join (  SELECT  c.id as mainsubcategoryId,
                                        s.id as subcategoryId,
                                        t.id as threadId,
                                        t.name as threadName,
                                        u.id as userId,
                                        u.name as userName,
                                        p.updatedAt as postDate,
                                        max(p.id) as postId
                                FROM 	(SELECT * FROM forum_test.subcategories as c WHERE c.id = ${subcatid}) as c
                                        join forum_test.subcategories as s on s.subcategoryId = c.id
                                        join forum_test.subcategories as s2 on ((s2.ancestors like CONCAT("%/", s.id, "/%")) or s.id = s2.id)
                                        join forum_test.threads as t on t.subcategoryId = s2.id
                                        join forum_test.posts as p on p.threadId = t.id
                                        join forum_test.users as u on p.userId = u.id
                                GROUP BY mainsubcategoryId, subcategoryId
                            ) as q2 on q1.mainsubcategoryId = q2.mainsubcategoryId and q1.subcategoryId = q2.subcategoryId and q1.maxDate = q2.postDate
                        ) as q3 on q3.mainsubcategoryId = c.id and q3.subcategoryId = s.id
            ORDER BY subCategoryPosition;`
        );
    },
    getThreadsQuery(subcatid) {
        return (
            `SELECT q1.mainsubcategoryId as mainsubcategoryId,
                    q1.mainSubCategoryName as mainSubCategoryName, 
                    q1.threadId as threadId,
                    q1.ThreadName as ThreadName, 
                    q1.ThreadName as threadName,
                    q1.ThreadMade as ThreadMade,
                    q2.totalPosts as totalPosts, 
                    q2.maxDate as maxDate, 
                    q1.userId as userId,
                    q1.userName as userName, 		
                    q1.postId as postId,
                    u2.id as creatorId,
                    u2.name as creatorName
            FROM (	SELECT  c.id as mainsubcategoryId,
                            c.name as mainSubCategoryName,
                            t.id as threadId,
                            t.name as ThreadName, 
                            t.createdAt as ThreadMade,
                            p.updatedAt as postDate,
                            u.id as userId,
                            u.name as userName,
                            max(p.id) as postId
                    FROM 	(SELECT * FROM forum_test.subcategories as c WHERE c.id = ${subcatid}) as c
                            join forum_test.threads as t on t.subcategoryId = c.id
                            join forum_test.posts as p on p.threadId = t.id
                            join forum_test.users as u on p.userId = u.id
                    GROUP BY mainsubcategoryId, threadId
                ) as q1
            join (  SELECT  c.id as mainsubcategoryId,
                            t.id as threadId,
                            count(*) as totalPosts,
                            max(p.updatedAt) as maxDate
                    FROM 	(SELECT * FROM forum_test.subcategories as c WHERE c.id = ${subcatid}) as c
                            join forum_test.threads as t on t.subcategoryId = c.id
                            join forum_test.posts as p on p.threadId = t.id
                    GROUP BY mainsubcategoryId, threadId
                ) as q2 on q1.mainsubcategoryId = q2.mainsubcategoryId and q1.threadId = q2.threadId and q1.postDate = q2.maxDate
            join forum_test.posts as p2	on p2.threadId = q1.threadId and p2.position = 1
            join forum_test.users as u2	on p2.userId = u2.id
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
                    r.ratingtypeId	as ratingtypeId,
                    r.ratingId      as ratingId,
                    r.userName		as ratingUserName,
                    r.userId		as ratinguserId,
                    u.id			as creatorId,
                    u.name			as creatorName,
                    u.avatar        as creatorAvatar,
                    qc.postCount	as postCount,
                    p.position      as postPosition
                
            FROM (SELECT * FROM forum_test.threads as t WHERE t.id = ${threadqueryid}) as t
                    join forum_test.posts as p on p.threadId = t.id
                    join forum_test.users as u on p.userId = u.id
                    join (
                        SELECT count(*) as postCount, p.userId as userId
                        FROM forum_test.posts as p 
                        WHERE p.userId in ( 
                                    SELECT u.id
                                    FROM (SELECT * FROM forum_test.threads as t WHERE t.id = ${threadqueryid}) as t
                                        join forum_test.posts as p on p.threadId = t.id
                                        join forum_test.users as u on p.userId = u.id
                        )
                        GROUP BY p.userId) as qc on qc.userId = u.id
                    left join (
                                SELECT rt.name		as ratingName,
                                    rt.id		as ratingtypeId,
                                    r.id        as ratingId,
                                    u.name		as userName,
                                    u.id			as userId,
                                    r.postId		as postId
                                FROM forum_test.ratings as r
                                            join forum_test.ratingtypes as rt on rt.id = r.ratingtypeId
                                            join forum_test.users as u on u.id = r.userId
                                
                                ) as r on r.postId = p.id
            ORDER BY postPosition, ratingtypeId;`
        );
    },
    getUserQuery(userqueryid) {
        return (
            `SELECT p.id		as postId,
                p.content		as postContent,
                p.createdAt		as postCreatedAt,
                p.threadId		as postthreadId,
                p.position		as postPosition,
                t.name			as threadName,
                u.name          as userName
            FROM forum_test.posts as p
                join forum_test.threads as t on t.id = p.threadId
                join forum_test.users as u on u.id = ${userqueryid}
            WHERE p.userId = ${userqueryid}
            ORDER BY postCreatedAt desc;`
        );
    },
    getUserMessageListQuery(userId) {
        return (
            `SELECT m.id		as messageId,
                m.name  		as messageName,
                m.createdAt		as messageCreatedAt
            FROM forum_test.messages as m
                join forum_test.messagemembers as mm on mm.messageId = m.id
            WHERE mm.userId = ${userId}
            ORDER BY messageCreatedAt desc;`
        );
    },
    getMessageQuery(messageId) {
        return (
            `SELECT mp.id		as messagepostId,
                mp.content 		as messagePostContent,
                mp.createdAt    as messagePostCreatedAt,
                u.name          as messageCreatorName,
                u.id            as messageCreatorId,
                qc.postCount	as messageCreatorPostCount,
                m.name          as messageName,
                m.id            as messageId
            FROM forum_test.messages as m
                join forum_test.messageposts as mp on mp.messageId = m.id
                left join forum_test.users as u on mp.userId = u.id
                join (
                    SELECT count(*) as postCount, p.userId as userId
                    FROM forum_test.posts as p 
                    WHERE p.userId in ( 
                                SELECT u.id
                                FROM (SELECT * FROM forum_test.messageposts as mp WHERE mp.messageId = ${messageId}) as mp
                                    join forum_test.users as u on mp.userId = u.id
                    )
                    GROUP BY p.userId) as qc on qc.userId = u.id
            WHERE m.id = ${messageId}
            ORDER BY messagePostCreatedAt;`
        );
    },
    getMessageMembersQuery(messageId) {
        return (
            `SELECT u.id		as userId,
                u.name 		    as userName,
                mm.id           as memberId,
                mm.permission   as memberPermission
            FROM forum_test.messagemembers as mm
                join forum_test.users as u on mm.userId = u.id
            WHERE mm.messageId = ${messageId}
            ORDER BY memberPermission DESC, userName ASC;`
        );
    },
    getCatHierarchy() {
        return (
            `SELECT id as categoryId,
                    name as categoryName
            FROM forum_test.categories
            ORDER BY position;`
        );
    },
    getSubcatHierarchy(threadId) {
        return (
              `(SELECT  s2.id as subcategoryId,
                        s2.name as subcategoryName,
                        s2.subcategoryId as parentSubcategoryId,
                        s2.categoryId as parentCategoryId,
                        s2.ancestors as ancestors,
                        s2.position as position,
                        1 as expanded
                FROM forum_test.subcategories as s
                join forum_test.threads as t on s.id = t.subcategoryId and t.id = ${threadId}
                join forum_test.subcategories as s2 on ((s.ancestors like CONCAT("%/", s2.id, "/%")) or s.id = s2.id))
                UNION
                (SELECT  s2.id as subcategoryId,
                        s2.name as subcategoryName,
                        s2.subcategoryId as parentSubcategoryId,
                        s2.categoryId as parentCategoryId,
                        s2.ancestors as ancestors,
                        s2.position as position,
                        0 as expanded
                FROM forum_test.subcategories as s
                join forum_test.threads as t on s.id = t.subcategoryId and t.id = ${threadId}
                join forum_test.subcategories as s2 on ((s.ancestors like CONCAT("%/", s2.subcategoryId, "/%") or s.id = s2.subcategoryId)
                or s2.categoryId IN (SELECT  s2.categoryId
                                    FROM forum_test.subcategories as s
                                    join forum_test.threads as t on s.id = t.subcategoryId and t.id = ${threadId}
                                    join forum_test.subcategories as s2 on ((s.ancestors like CONCAT("%/", s2.id, "/%")) or s.id = s2.id) and s2.categoryId IS NOT NULL)
                )
                and not ((s.ancestors like CONCAT("%/", s2.id, "/%")) or s.id = s2.id))
                ORDER BY CHAR_LENGTH(ancestors), position`
        );
    },
    getChildThreadHierarchy(threadId) {
        return (
            `SELECT  t2.id as threadId,
                    t2.name as threadName,
                    t2.subcategoryId as parentSubcategoryId
            FROM forum_test.subcategories as s
            join forum_test.threads as t on s.id = t.subcategoryId and t.id = ${threadId}
            join forum_test.threads as t2 on (s.ancestors like CONCAT("%/", t2.subcategoryId, "/%") or s.id = t2.subcategoryId)
            join forum_test.subcategories as s2 on s2.id = t2.subcategoryId
            join (  SELECT  max(updatedAt) as maxDate,
                            threadId
                    FROM 	forum_test.posts
                    GROUP BY threadId
                ) as q1 on t2.id = q1.threadId
            ORDER BY CHAR_LENGTH(s2.ancestors), q1.maxDate DESC;`
        );
    }
}