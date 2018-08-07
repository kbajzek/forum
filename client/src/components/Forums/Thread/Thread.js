import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import * as threadActions from '../../../store/ducks/thread';

import Post from './Post/Post';
import Spinner from '../../UI/Spinner/Spinner';
import ErrorPage from '../ErrorPage/ErrorPage';

import classes from './Thread.module.css';

import FlipMove from 'react-flip-move';

class Thread extends Component {
    
    componentDidMount() {
        this.props.onInitThreadData(this.props.id, true);
    }

    handlePostCreator = () => {
        const threadName = threadActions.getThreadName(this.props.threadData);
        this.props.handlePostCreate(this.props.id, this.props.slug, threadName);
    }

    render() {

        let threadButton = this.props.auth ? <button onClick={this.handlePostCreator}>CREATE POST</button> : null;
        const threadErrors = threadActions.getThreadErrors(this.props.threadData);
        const threadLoading = threadActions.getThreadLoading(this.props.threadData);
        const threadLoaded = threadActions.getThreadLoaded(this.props.threadData);
        const threadPosts = threadActions.getThreadPosts(this.props.threadData);
        const threadName = threadActions.getThreadName(this.props.threadData);
        const threadId = threadActions.getThreadId(this.props.threadData);
        const threadSlug = threadActions.getThreadSlug(this.props.threadData);
        const threadRatingTypes = threadActions.getThreadRatingTypes(this.props.threadData);

        let threadpage;

        if(threadErrors.length > 0){

            threadpage = <ErrorPage error = {threadErrors[0]}/>

        // }else if(threadLoading){

        //     threadpage = <Spinner />

        }else if(threadLoaded){

            const postList = threadPosts.map(({id, content, ratings, creator}) => {
                return (
                    <div key={id}>
                        <Post 
                            threadData = {this.props.threadData}
                            content={content}
                            ratings={ratings}
                            user={creator}
                            id={id}
                            threadId={threadId}
                            threadName={threadName}
                            threadSlug={threadSlug}
                            ratingTypes={threadRatingTypes}
                            handleEdit={this.props.handlePostEdit}
                            handleDelete={this.props.handlePostDelete}
                            handleQuote={this.props.handlePostQuote}
                            handleReply={this.props.handlePostReply}
                            auth={this.props.auth} />
                    </div>
                );
            });

            threadpage = (
                <div>
                    {threadButton}
                    <div className={classes.Header}>{threadName}</div>
                    <div className={classes.Thread}>
                        {/* <FlipMove
                            duration={500}
                            enterAnimation="fade"
                            leaveAnimation={false}> */}
                            {postList}
                        {/* </FlipMove> */}
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
        threadData: state.thread,
        auth: state.auth.user
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onInitThreadData: (threadId, clearFirst) => dispatch(threadActions.fetchThreadDataBegin(threadId, clearFirst))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Thread));