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
                    totalPosts={props.user.totalPosts}
                    path={props.user.path} />
                <div className={classes.RightSide}>
                    <div className={classes.Content}>
                        <PostContent content={props.content} />
                    </div>
                    <Ratings 
                        ratings={props.ratings} 
                        ratingTypes={props.ratingTypes} 
                        auth={props.auth} 
                        userId={props.user.userId} 
                        postId={props.id} 
                        path={"/thread/" + props.threadId + "/" + props.threadSlug}/>
                    {props.auth && (<div style={{display: 'flex'}}>
                        <button onClick={() => {props.handleEdit(props.id, props.content, props.threadId, props.threadSlug, props.threadName)}}>EDIT</button>
                        <button onClick={() => {props.handleDelete(props.id, props.threadId, props.threadSlug)}}>DELETE</button>
                        <button onClick={() => {props.handleQuote(props.user.name, props.id, props.threadId, props.threadSlug, props.threadName, props.content)}}>QUOTE</button>
                        <button onClick={() => {props.handleReply(props.user.name, props.id, props.threadId, props.threadSlug, props.threadName, props.content)}}>REPLY</button>
                    </div>)}
                </div>
        </div>
    );
    
}

export default Post;