import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';

import * as threadActions from '../../../store/ducks/thread';

import Post from './Post/Post';
// import Spinner from '../../UI/Spinner/Spinner';
import ErrorPage from '../ErrorPage/ErrorPage';

import classes from './Thread.module.css';

// import FlipMove from 'react-flip-move';

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
        // const threadLoading = threadActions.getThreadLoading(this.props.threadData);
        const threadLoaded = threadActions.getThreadLoaded(this.props.threadData);
        const threadPosts = threadActions.getThreadPosts(this.props.threadData);
        const threadName = threadActions.getThreadName(this.props.threadData);
        const threadId = threadActions.getThreadId(this.props.threadData);
        const threadSlug = threadActions.getThreadSlug(this.props.threadData);
        const threadRatingTypes = threadActions.getThreadRatingTypes(this.props.threadData);
        const threadUsersViewing = threadActions.getThreadUsersViewing(this.props.threadData);
        const threadBreadcrumb = threadActions.getThreadBreadcrumb(this.props.threadData);

        let threadpage;
        let usersViewing;
        let threadBreadcrumbComponent;

        if(threadErrors.length > 0){

            threadpage = <ErrorPage error = {threadErrors[0]}/>

        // }else if(threadLoading){

        //     threadpage = <Spinner />

        }else if(threadLoaded){

            threadBreadcrumbComponent = threadBreadcrumb.reduce((array, crumb, index) => {
                if(crumb.categoryId){
                    return array.concat([(
                        <Link
                            style={{textDecoration: 'none', fontSize: '1.6rem'}}
                            key={crumb.categoryId + " (category)"}
                            to={{
                                pathname: "/forums"
                            }}>
                            {crumb.categoryName}
                        </Link>
                    )]);
                }else{
                    return array.concat([(
                        <div
                            key={crumb.subcategoryId + "/"}
                            style={{fontSize: '1.6rem', padding: '0 .3rem'}}
                            >
                            /
                        </div>
                    ),(
                        threadBreadcrumb.length - 1 !== index
                        ? <Link
                            style={{textDecoration: 'none', fontSize: '1.6rem'}}
                            key={crumb.subcategoryId}
                            to={{
                                pathname: "/forums" + crumb.subcategoryPath
                            }}>
                            {crumb.subcategoryName}
                        </Link> 
                        : <div
                            style={{fontSize: '1.6rem'}}
                            key={crumb.threadId + " (thread)"}>
                            {crumb.threadName}
                        </div> 
                    )]);
                }
            }, []);

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

            usersViewing = threadUsersViewing.map((user) => {
                return (
                    <img
                        key={user.id}
                        style={{display: 'inline-block', width: '5rem', height: '5rem', borderRadius: '50%'}}
                        src={user.avatar} 
                        alt={user.name} />
                );
            });

            threadpage = (
                <div>
                    {threadButton}
                    <div className={classes.Header}>{threadName}</div>
                    <div
                        style={{display: 'flex', flexDirection: 'row', margin: '2rem'}}
                        >{threadBreadcrumbComponent}</div>
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
                {usersViewing}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Thread));