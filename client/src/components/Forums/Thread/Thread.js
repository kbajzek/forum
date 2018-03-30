import React, {Component} from 'react';

import Post from './Post/Post';

import classes from './Thread.module.css';


const example_thread = {
    name: "go fuck a tree branch bitch",
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
            postCreator: {
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
            postCreator: {
                name: "ssssss",
                pictureURL: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/81/8117d1780455347891a44ccb80a45c6d693ebfae_full.jpg",
                totalPosts: "235",
                signature: "asdfasdf"
            }
        }
    ]
};

class Thread extends Component {
    
    


    render() {

        const postList = example_thread.posts.map(({id, content, ratings, postCreator}) => {
            return (
                <Post 
                    key={id}
                    content={content}
                    ratings={ratings}
                    user={postCreator} />
            );
        });

        return (
            <div className={classes.Thread}>
                {postList}
            </div>
        );
    }
}

export default Thread;