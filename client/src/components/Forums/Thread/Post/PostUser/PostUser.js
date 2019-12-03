import React from 'react';
import {Link} from 'react-router-dom';

import classes from './PostUser.module.css';

const PostUser = (props) => {
    

    
    return (
        <div className={classes.PostUser}>
            <div>{props.name}</div>
            <div className={classes.ProfileLinkContainer}>
                <div
                    className={classes.ProfileLink}>
                    <img
                        className={classes.ProfilePicture}
                        src={props.pictureURL} 
                        alt={props.name} />
                </div>
                {/* <Link
                    to={{
                        pathname: "/forums" + props.path
                    }}
                    className={classes.ProfileLink}>
                    <img
                        className={classes.ProfilePicture}
                        src={props.pictureURL} 
                        alt={props.name} />
                </Link> */}
            </div>
            
            <div className={classes.TotalPosts}>{props.totalPosts} <span> POSTS</span></div>
        </div>
    );
    
}

export default PostUser;