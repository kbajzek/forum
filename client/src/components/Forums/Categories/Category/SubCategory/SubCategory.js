import React, {Component} from 'react';
import classes from './SubCategory.module.css';
import {withRouter, Link} from 'react-router-dom';

class SubCategory extends Component {

    render() {

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
                
    
                <div className={classes.LastThreadInfo}>
                    <div>{this.props.lastActiveThread.name}</div>
                    <div>{this.props.lastActiveThread.user}</div>
                    <div>{this.props.lastActiveThread.lastUpdated}</div>
                </div>
            </div>
        );
    }
    
}

export default withRouter(SubCategory);