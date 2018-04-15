import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import * as actions from '../../../store/actions';

import Post from './Post/Post';
import Spinner from '../../UI/Spinner/Spinner';

import classes from './Thread.module.css';

class Thread extends Component {
    
    componentDidMount() {
        this.props.onInitThreadData("/thread/" + this.props.id + "/" + this.props.slug);
    }


    render() {
        let threadpage = this.props.error ? <p>error occured with the backend api</p> : <Spinner />;

        if (this.props.threadData) {
            const postList = this.props.threadData.posts.map(({id, content, ratings, creator}) => {
                return (
                    <Post 
                        key={id}
                        content={content}
                        ratings={ratings}
                        user={creator} />
                );
            });

            threadpage = (
                <div>
                    <div className={classes.Header}>{this.props.threadData.name}</div>
                    <div className={classes.Thread}>
                        {postList}
                    </div>
                </div>
            );
        }

        return (
            <div>
                {threadpage}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        threadData: state.forums.threadData,
        error: state.forums.error
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onInitThreadData: (path) => dispatch(actions.initThreadData(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Thread));