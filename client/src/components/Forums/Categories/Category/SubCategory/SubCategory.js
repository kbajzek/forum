import React, {Component} from 'react';
import timeago from 'time-ago';

import classes from './SubCategory.module.css';
import {withRouter, Link} from 'react-router-dom';


class SubCategory extends Component {

    render() {

        let lastThread = null;

        if (this.props.lastActiveThread.path !== 'none') {
            lastThread = (
                <div className={classes.LastThreadInfo}>
                    <Link
                        to={{
                            pathname: "/forums" + this.props.lastActiveThread.path
                        }}
                        className={classes.Name}>
                        {this.props.lastActiveThread.name}
                    </Link>
                    <div>{this.props.lastActiveThread.user}</div>
                    <div>{timeago.ago(new Date(this.props.lastActiveThread.lastUpdated))}</div>
                </div>
            );
        } else {
            lastThread = (
                <div className={classes.LastThreadInfo}>
                    <div>{this.props.lastActiveThread.name}</div>
                    <div>{this.props.lastActiveThread.user}</div>
                    <div>{timeago.ago(new Date(this.props.lastActiveThread.lastUpdated))}</div>
                </div>
            );
        }

        return (
            <div className={classes.SubCategory}>
                <div className={[classes.PushRight, classes.Part1].join(' ')}>
                    <Link
                        to={{
                            pathname: "/forums" + this.props.pathName
                        }}
                        className={classes.Name}>
                        {this.props.name}
                    </Link>
                    <div>{this.props.description}</div>
                </div>
                
                <div className={classes.PostCount}>
                    <div>{this.props.totalPosts}</div>
                    <div>POSTS</div>
                </div>
    
                {lastThread}

            </div>
        );
    }
    
}

export default withRouter(SubCategory);