import React from 'react';

import PostUser from './PostUser/PostUser';
import Ratings from './Ratings/Ratings';
import PostContent from './PostContent/PostContent';

import classes from './Post.module.css';

const Post = (props) => {
    
    return (
        <div className={classes.Post}>
            <PostUser 
                name={props.user.name}
                pictureURL={props.user.pictureURL}
                totalPosts={props.user.totalPosts} />
            <div className={classes.RightSide}>
                <div className={classes.Content}>
                    <PostContent content={props.content} />
                </div>
                <Ratings ratings={props.ratings} />
            </div>
        </div>
    );
    
}

export default Post;