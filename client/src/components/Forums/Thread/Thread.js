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

    handlePostCreator = () => {
        this.props.handlePostCreate(this.props.id, this.props.slug, this.props.threadData.name);
    }

    render() {

        let threadpage = this.props.error ? <p>error occured with the backend api</p> : <Spinner />;

        if (this.props.threadData) {

            const postList = this.props.threadData.posts.map(({id, content, ratings, creator}) => {
                return (
                    <Post 
                        threadData = {this.props.threadData}
                        key={id}
                        content={content}
                        ratings={ratings}
                        user={creator}
                        id={id}
                        ratingTypes={this.props.threadData.ratingTypes}
                        handleEdit={this.props.handlePostEdit}
                        handleDelete={this.props.handlePostDelete}
                        handleQuote={this.props.handlePostQuote}
                        handleReply={this.props.handlePostReply} />
                );
            });

            threadpage = (
                <div>
                    <button onClick={this.handlePostCreator}>CREATE POST</button>
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