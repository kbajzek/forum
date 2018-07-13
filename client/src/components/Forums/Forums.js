import React, {Component} from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {change, getFormValues} from 'redux-form';

import * as actions from '../../store/actions';

import PostForm from '../Forms/PostForm/PostForm';
import Categories from './Categories/Categories';
import SubCategoryPage from './SubCategoryPage/SubCategoryPage';
import Thread from './Thread/Thread';
import UserPage from './UserPage/UserPage';
import MessagePage from './MessagePage/MessagePage';

import classes from './Forums.module.css';

const CREATE_THREAD = 1;
const CREATE_POST = 2;
const EDIT_POST = 3;
const CREATE_MESSAGE = 4;
const CREATE_MESSAGE_POST = 5;
const EDIT_MESSAGE_POST = 6;

class Forums extends Component {

    state={
        writerActive: false,
        writerOpen: false,
    }

    componentDidMount() {
        this.props.fetchUser();
    }

    handlePostEdit = (postId, postContent, threadId) => {
        this.props.changeWriterMode(EDIT_POST);
        this.props.changeWriterThreadId(threadId);
        this.props.changeWriterPostId(postId);
        this.props.changeWriterContent(postContent);
        this.setState({
            writerOpen: true,
            writerActive: true
        });
    }

    handlePostDelete = (postId) => {
        this.props.onDeletePost(postId, null, this.props.history);
    }

    handlePostQuote = (userName, postId, threadId, threadSlug, threadName, postContent) => {
        this.props.changeWriterMode(CREATE_POST);
        if(!this.props.postValues || !this.props.postValues.threadId || this.props.postValues.threadId === '') {
            this.props.changeWriterThreadId(threadId);
        }
        

        let beginning = '\n\n';
        if(!this.props.postValues || !this.props.postValues.content || this.props.postValues.content === '') {
            beginning = '';
        }
        const quoteHeader = beginning + userName + " said in [url=/forums/thread/" + threadId + "/" + threadSlug + "#" + postId + "]" + threadName + "[/url]:";
        const quoteContent = "\n[quote]" + postContent + "[/quote]\n\n";
        const oldContent = this.props.postValues ? this.props.postValues.content : '';

        this.props.changeWriterContent(oldContent + quoteHeader + quoteContent);
        this.setState({
            writerOpen: true,
            writerActive: true
        });
    }

    handlePostReply = (userName, postId, threadId, threadSlug, threadName, postContent) => {
        this.props.changeWriterMode(CREATE_POST);
        this.props.changeWriterThreadId(threadId);

        let beginning = '\n\n';
        if(!this.props.postValues || !this.props.postValues.content || this.props.postValues.content === '') {
            beginning = '';
        }
        const quoteHeader = beginning + userName + " said in [url=/forums/thread/" + threadId + "/" + threadSlug + "#" + postId + "]" + threadName + "[/url]:";
        const quoteContent = "\n[quote]" + postContent + "[/quote]\n\n";
        const oldContent = this.props.postValues ? this.props.postValues.content : '';

        this.props.changeWriterContent(oldContent + quoteHeader + quoteContent);
        this.setState({
            writerOpen: true,
            writerActive: true
        });
    }

    handleThreadCreate = (subCategoryId) => {
        this.props.changeWriterMode(CREATE_THREAD);
        this.props.changeWriterSubCategoryId(subCategoryId);
        this.props.changeWriterContent('');
        this.setState({
            writerOpen: true,
            writerActive: true
        });
    }

    handleMessageCreate = () => {
        this.props.changeWriterMode(CREATE_MESSAGE);
        this.props.changeWriterMembers([]);
        this.props.changeWriterContent('');
        this.setState({
            writerOpen: true,
            writerActive: true
        });
    }

    handleMessageReply = (id) => {
        this.props.changeWriterMode(CREATE_MESSAGE_POST);
        this.props.changeWriterMessageId(id);
        this.props.changeWriterContent('');
        this.setState({
            writerOpen: true,
            writerActive: true
        });
    }

    handlePostCreate = (threadId) => {
        this.props.changeWriterMode(CREATE_POST);
        this.props.changeWriterThreadId(threadId);
        this.props.changeWriterContent('');
        this.setState({
            writerOpen: true,
            writerActive: true
        });
    }

    toggleWriter = () => {
        this.setState((prevState) => {
            return {writerOpen: !prevState.writerOpen}
         });
    }

    closeWriter = () => {
        this.setState({
            writerOpen: false,
            writerActive: false
        });
    }

    render() {

        let editor=null;
        let editorButton;
        if (this.state.writerActive) {
            editorButton = (
                <button 
                    onClick={this.toggleWriter} 
                    style={{position: 'fixed', bottom: '0px', right: '0px', 'zIndex': '10'}}>
                    EDITOR
                </button>
            );
        }

        let pad='0rem';

        if(this.state.writerOpen){
            pad = '40rem';
            editor=(
                <div style={{position: 'fixed', bottom: '0px', left: '0px', right: '0px', backgroundColor: '#778899', height: '40rem'}}>
                    <PostForm closeForm={this.closeWriter}/>
                </div>
            );
        }

        return (
            <div className={classes.Forums} style={{paddingBottom: `${pad}`}}>
                <Switch>
                    <Route path="/forums" exact render={() => {
                        return (
                            <div>
                                <Categories />
                                {editorButton}
                            </div>
                        )
                    }} />
                    <Route path="/forums/thread/:id/:slug" render={({match}) => {
                        return (
                            <div>
                                <Thread 
                                    key={match.params.id} 
                                    id={match.params.id} 
                                    slug={match.params.slug} 
                                    handlePostCreate={this.handlePostCreate}
                                    handlePostEdit={this.handlePostEdit}
                                    handlePostDelete={this.handlePostDelete}
                                    handlePostQuote={this.handlePostQuote}
                                    handlePostReply={this.handlePostReply}/>
                                {editorButton}
                            </div>
                        );
                    }} />
                    <Route path="/forums/user/:id/:slug" render={({match}) => {
                        return (
                            <div>
                                <UserPage 
                                    key={match.params.id} 
                                    id={match.params.id} 
                                    slug={match.params.slug}/>
                                {editorButton}
                            </div>
                        );
                    }} />
                    <Route path="/forums/message/:id/:slug" render={({match}) => {
                        return (
                            <div>
                                <MessagePage 
                                    key={match.params.id} 
                                    id={match.params.id} 
                                    slug={match.params.slug} 
                                    handleMessageCreate={this.handleMessageCreate}
                                    handleMessageReply={this.handleMessageReply}/>
                                {editorButton}
                            </div>
                        );
                    }} />
                    <Route path="/forums/message" render={({match}) => {
                        return (
                            <div>
                                <MessagePage 
                                    handleMessageCreate={this.handleMessageCreate}
                                    handleMessageReply={this.handleMessageReply}/>
                                {editorButton}
                            </div>
                        );
                    }} />
                    <Route path="/forums/:id/:slug" render={({match}) => {
                        return (
                            <div>
                                <SubCategoryPage key={match.params.id} id={match.params.id} slug={match.params.slug} handleThreadCreate={this.handleThreadCreate}/>
                                {editorButton}
                            </div>
                        );
                    }} />
                </Switch>
                {editor}

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        threadData: state.forums.threadData,
        postValues: getFormValues('postForm')(state)
    }
}

const mapDispatchToProps = (dispatch) => {
	return {
        changeWriterMode : (value) => dispatch(change('postForm', 'mode', value)),
        changeWriterSubCategoryId : (value) => dispatch(change('postForm', 'subCategoryId', value)),
        changeWriterThreadId : (value) => dispatch(change('postForm', 'threadId', value)),
        changeWriterPostId : (value) => dispatch(change('postForm', 'postId', value)),
        changeWriterMessageId : (value) => dispatch(change('postForm', 'messageId', value)),
        changeWriterMessagePostId : (value) => dispatch(change('postForm', 'messagePostId', value)),
        changeWriterMembers : (value) => dispatch(change('postForm', 'members', value)),
        changeWriterTitle : (value) => dispatch(change('postForm', 'title', value)),
        changeWriterContent : (value) => dispatch(change('postForm', 'content', value)),
        onDeletePost: (postId, path, history) => dispatch(actions.deletePost(postId, path, history)),
        fetchUser: () => dispatch(actions.fetchUserInit())
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Forums));