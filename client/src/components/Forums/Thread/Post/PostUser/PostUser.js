import React from 'react';

import classes from './PostUser.module.css';

const PostUser = (props) => {
    

    
    return (
        <div className={classes.PostUser}>
            <div>{props.name}</div>
            <img
                className={classes.ProfilePicture}
                src={props.pictureURL} 
                alt={props.name} />
            <div className={classes.TotalPosts}>{props.totalPosts} <span> POSTS</span></div>
        </div>
    );
    
}

export default PostUser;