import React from 'react';
import {withRouter, Link} from 'react-router-dom';

import classes from './ThreadPreview.module.css';

const ThreadPreview = (props) => {
    return (
        <div className={classes.ThreadPreview}>
            <div className={[classes.PushRight, classes.Part1].join(' ')}>
                <Link
                    to={{
                        pathname: "/forums" + props.pathName
                    }}
                    className={classes.Name}>
                    {props.name}
                </Link>
                <div>{props.createdOn}</div>
                <div>{props.creator}</div>
            </div>
            
            <div className={classes.ReplyCount}>
                <div>{props.totalReplies}</div>
                <div>REPLIES</div>
            </div>

            <div className={classes.ViewCount}>
                <div>{props.totalViews}</div>
                <div>VIEWS</div>
            </div>
            

            <div className={classes.lastPost}>
                <div>{props.lastPost.name}</div>
                <div>{props.lastPost.user}</div>
                <div>{props.lastPost.lastUpdated}</div>
            </div>
        </div>
    );
}

export default withRouter(ThreadPreview);