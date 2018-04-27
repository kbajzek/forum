import React from 'react';
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor'

import PostUser from './PostUser/PostUser';
import Ratings from './Ratings/Ratings';
import PostContent from './PostContent/PostContent';

import classes from './Post.module.css';

configureAnchors({offset: -60, scrollDuration: 400})

const Post = (props) => {
    
    return (
        <div className={classes.Post}>
            <ScrollableAnchor id={`${props.id}`}><div></div></ScrollableAnchor>
                <PostUser 
                    name={props.user.name}
                    pictureURL={props.user.pictureURL}
                    totalPosts={props.user.totalPosts} />
                <div className={classes.RightSide}>
                    <div className={classes.Content}>
                        <PostContent content={props.content} />
                    </div>
                    <Ratings ratings={props.ratings} />
                    <button onClick={() => {props.handleEdit(props.id)}}>EDIT</button>
                    <button onClick={() => {props.handleDelete(props.id)}}>DELETE</button>
                </div>
        </div>
    );
    
}

export default Post;