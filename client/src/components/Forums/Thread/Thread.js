import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import * as actions from '../../../store/actions';

import Post from './Post/Post';
import Spinner from '../../UI/Spinner/Spinner';
import PostForm from '../../Forms/PostForm/PostForm';

import classes from './Thread.module.css';

class Thread extends Component {

    state = {
        showPostForm: false
    }
    
    componentDidMount() {
        this.props.onInitThreadData("/thread/" + this.props.id + "/" + this.props.slug);
    }

    togglePostCreator = () => {
        this.setState((prevState) => {
            return {showPostForm: !prevState.showPostForm}
         });
    }

    closePostCreator = () => {
        this.setState({showPostForm: false});
    }


    render() {

        let postForm;

        let threadpage = this.props.error ? <p>error occured with the backend api</p> : <Spinner />;

        if (this.props.threadData) {

            if(this.state.showPostForm) {
                postForm = <PostForm closeForm={this.closePostCreator} threadId={this.props.threadData.id} path={"/thread/" + this.props.id + "/" + this.props.slug} />
            }

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
                <button onClick={this.togglePostCreator}>CREATE POST</button>
                {postForm}
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