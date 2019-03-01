const example_thread = {
    name: "jjj",
    posts: [
        {
            id: 1,
            content: "hiiiiiiiiiiiiiiiiiiiiiii",
            ratings: [
                {
                    ratingName: "Like",
                    users: [
                        {userName: "ssss"}
                    ]
                },
                {
                    ratingName: "Dislike",
                    users: [
                        {userName: "ssss"}
                    ]
                }
            ],
            creator: {
                name: "ssssss",
                pictureURL: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/81/8117d1780455347891a44ccb80a45c6d693ebfae_full.jpg",
                totalPosts: "235",
                signature: "asdfasdf"
            }
        },
        {
            id: 2,
            content: "hiiiiiiiiiiiiiiiiiiiiiii",
            ratings: [
                {
                    ratingName: "Like",
                    users: [
                        {userName: "ssss"}
                    ]
                },
                {
                    ratingName: "Dislike",
                    users: [
                        {userName: "ssss"}
                    ]
                }
            ],
            creator: {
                name: "ssssss",
                pictureURL: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/81/8117d1780455347891a44ccb80a45c6d693ebfae_full.jpg",
                totalPosts: "235",
                signature: "asdfasdf"
            }
        }
    ]
};

const example_categories = [
    {
        id: 1,
        name: "Category 1",
        subCategories: [
            {
                id: 1,
                path: "/1/subcategory-1",
                name: "Subcategory 1",
                description: "Subcat Desc 1",
                totalPosts: "8.3K",
                lastActiveThread: {
                    name: "LastThread1",
                    user: "username1",
                    lastUpdated: "17 minutes ago",
                    path: "/thread/1/lastthread1"
                }
            },
            {
                id: 2,
                path: "/2/subcategory-2",
                name: "Subcategory 2",
                description: "Subcat Desc 2",
                totalPosts: "5.2K",
                lastActiveThread: {
                    name: "LastThread2",
                    user: "username2",
                    lastUpdated: "23 minutes ago",
                    path: "/thread/2/lastthread2"
                }
            },
            {
                id: 3,
                path: "/3/subcategory-3",
                name: "Subcategory 3",
                description: "Subcat Desc 3",
                totalPosts: "9.1K",
                lastActiveThread: {
                    name: "LastThread3",
                    user: "username3",
                    lastUpdated: "5 minutes ago",
                    path: "/thread/2/lastthread2"
                }
            }
        ]
    },
    {
        id: 2,
        name: "Category 2",
        subCategories: [
            {
                id: 4,
                path: "/4/subcategory-4",
                name: "Subcategory 4",
                description: "Subcat Desc 4",
                totalPosts: "8.3K",
                lastActiveThread: {
                    name: "LastThread4",
                    user: "username4",
                    lastUpdated: "17 minutes ago",
                    path: "/thread/2/lastthread2"
                }
            },
            {
                id: 5,
                path: "/5/subcategory-5",
                name: "Subcategory 5",
                description: "Subcat Desc 5",
                totalPosts: "5.5K",
                lastActiveThread: {
                    name: "LastThread5",
                    user: "username5",
                    lastUpdated: "53 minutes ago",
                    path: "/thread/2/lastthread2"
                }
            },
            {
                id: 6,
                path: "/6/subcategory-6",
                name: "Subcategory 6",
                description: "Subcat Desc 6",
                totalPosts: "9.1K",
                lastActiveThread: {
                    name: "LastThread6",
                    user: "username6",
                    lastUpdated: "5 minutes ago",
                    path: "/thread/2/lastthread2"
                }
            }
        ]
    }
];

const example_subcategorypage = {
    name: "asdfasdfasdf",
    subCategories: [
        {
            id: 1,
            path: "/1/subcategory-1",
            name: "Subcategory 1",
            description: "Subcat Desc 1",
            totalPosts: "8.3K",
            lastActiveThread: {
                name: "LastThread1",
                user: "username1",
                lastUpdated: "17 minutes ago",
                path: "/thread/2/lastthread2"
            }
        },
        {
            id: 2,
            path: "/2/subcategory-2",
            name: "Subcategory 2",
            description: "Subcat Desc 2",
            totalPosts: "5.2K",
            lastActiveThread: {
                name: "LastThread2",
                user: "username2",
                lastUpdated: "23 minutes ago",
                path: "/thread/2/lastthread2"
            }
        }
    ],
    threads: [
        {
            id: 1,
            path: "/thread/1/thread-1",
            name: "thread 1",
            creator: "user1",
            createdOn: "june 12 3827",
            totalReplies: "8.3K",
            totalViews: "242",
            lastPost: {
                name: "Last post 1",
                user: "username1",
                lastUpdated: "23 minutes ago"
            }
        },
        {
            id: 2,
            path: "/thread/2/thread-2",
            name: "thread 2",
            creator: "ddd",
            createdOn: "june 12 1812",
            totalReplies: "353",
            totalViews: "242",
            lastPost: {
                name: "last ff 2",
                user: "username2",
                lastUpdated: "23 minutes ago"
            }

        }
    ]
};