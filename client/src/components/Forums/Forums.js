import React, {Component} from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {change, getFormValues} from 'redux-form';

import * as actions from '../../store/actions';
import * as threadActions from '../../store/ducks/thread';

import PostForm from '../Forms/PostForm/PostForm';
import Categories from './Categories/Categories';
import SubCategoryPage from './SubCategoryPage/SubCategoryPage';
import Thread from './Thread/Thread';
import UserPage from './UserPage/UserPage';
import MessagePage from './MessagePage/MessagePage';
import doubleArrow from './DoubleArrow.svg';

import { Transition, TransitionGroup } from 'react-transition-group';

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
        topDeltaY: 0,
        writerY: 70
    }

    componentDidMount() {
        this.props.fetchUser();
    }

    handleTouchStart = ({ touches: [{ screenY }] }) => {
        const mouseY = screenY;
        this.setState((prevState) => ({
            topDeltaY: mouseY - prevState.writerY,
            isPressed: true
        }));
        window.addEventListener("touchmove", this.handleTouchMove);
        window.addEventListener("touchend", this.handleTouchEnd);
    };

    handleTouchMove = ({touches: [{ screenY }] }) => {
        const { isPressed, topDeltaY } = this.state;
        if (isPressed) {
            const mouseY = Math.max(Math.min(screenY-topDeltaY,window.innerHeight-250),70);
            this.setState({ writerY: mouseY })
        }
    }

    handleTouchEnd = () => {
        this.setState({ isPressed: false, topDeltaY: 0 });
        window.removeEventListener("touchmove", this.handleTouchMove);
        window.removeEventListener("touchend", this.handleTouchEnd);
    };

    handleMouseDown = ({ screenY }) => {
        const mouseY = screenY;
        this.setState((prevState) => ({
            topDeltaY: mouseY - prevState.writerY,
            isPressed: true
        }));
        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseMove = (e) => {
        e.preventDefault();
        const screenY = e.screenY;
        const { isPressed, topDeltaY } = this.state;
        if (isPressed) {
            const mouseY = Math.max(Math.min(screenY-topDeltaY,window.innerHeight-250),70);
            this.setState({ writerY: mouseY })
        }
    }

    handleMouseUp = () => {
        this.setState({ isPressed: false, topDeltaY: 0 });
        window.removeEventListener("mouseup", this.handleMouseUp);
        window.removeEventListener("mousemove", this.handleMouseMove);
    };

    onExit = () => {
        this.props.waitOnExitingPage(true);
        this.props.hidePage(true);
    }

    onExited = () => {
        this.props.waitOnExitingPage(false);
        window.scrollTo(0,0);
    }

    handlePostEdit = (postId, postContent, threadId, threadSlug, threadName) => {
        this.props.changeWriterMode(EDIT_POST);
        this.props.changeWriterThread({id: threadId, name: threadName});
        this.props.changeWriterPostId(postId);
        this.props.changeWriterContent(postContent);
        this.setState({
            writerOpen: true,
            writerActive: true
        });
    }

    handlePostDelete = (postId) => {
        this.props.onDeletePost(postId, this.props.history);
    }

    handlePostQuote = (userName, postId, threadId, threadSlug, threadName, postContent) => {
        if(!this.props.postValues || 
            (((!this.props.postValues.threadId || this.props.postValues.threadId === '') && (this.props.postValues.mode === EDIT_POST || this.props.postValues.mode === CREATE_POST || this.props.postValues.mode === CREATE_THREAD)) && 
            ((!this.props.postValues.messageId || this.props.postValues.messageId === '') && (this.props.postValues.mode === EDIT_MESSAGE_POST || this.props.postValues.mode === CREATE_MESSAGE_POST || this.props.postValues.mode === CREATE_MESSAGE)))
        ) {

            this.props.changeWriterMode(CREATE_POST);
            this.props.changeWriterThread({id: threadId, name: threadName});
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
        this.props.changeWriterThread({id: threadId, name: threadName});

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

    handleMessagePostEdit = (messagePostId, messagePostContent, messageId) => {
        this.props.changeWriterMode(EDIT_MESSAGE_POST);
        this.props.changeWriterMessageId(messageId);
        this.props.changeWriterMessagePostId(messagePostId);
        this.props.changeWriterContent(messagePostContent);
        this.setState({
            writerOpen: true,
            writerActive: true
        });
    }

    handleMessagePostDelete = (messagePostId) => {
        this.props.onDeleteMessagePost(messagePostId, null, this.props.history);
    }

    handleMessagePostQuote = (userName, messagePostId, messageId, messageSlug, messageName, messagePostContent) => {
        if(!this.props.postValues || 
            (((!this.props.postValues.threadId || this.props.postValues.threadId === '') && (this.props.postValues.mode === EDIT_POST || this.props.postValues.mode === CREATE_POST || this.props.postValues.mode === CREATE_THREAD)) && 
            ((!this.props.postValues.messageId || this.props.postValues.messageId === '') && (this.props.postValues.mode === EDIT_MESSAGE_POST || this.props.postValues.mode === CREATE_MESSAGE_POST || this.props.postValues.mode === CREATE_MESSAGE)))
        ) {

            this.props.changeWriterMode(CREATE_MESSAGE_POST);
            this.props.changeWriterMessageId(messageId);

        }
        

        let beginning = '\n\n';
        if(!this.props.postValues || !this.props.postValues.content || this.props.postValues.content === '') {
            beginning = '';
        }
        const quoteHeader = beginning + userName + " said in [url=/forums/message/" + messageId + "/" + messageSlug + "#" + messagePostId + "]" + messageName + "[/url]:";
        const quoteContent = "\n[quote]" + messagePostContent + "[/quote]\n\n";
        const oldContent = this.props.postValues ? this.props.postValues.content : '';

        this.props.changeWriterContent(oldContent + quoteHeader + quoteContent);
        this.setState({
            writerOpen: true,
            writerActive: true
        });
    }

    handleMessagePostReply = (userName, messagePostId, messageId, messageSlug, messageName, messagePostContent) => {
        this.props.changeWriterMode(CREATE_MESSAGE_POST);
        this.props.changeWriterMessageId(messageId);
        
        let beginning = '\n\n';
        if(!this.props.postValues || !this.props.postValues.content || this.props.postValues.content === '') {
            beginning = '';
        }
        const quoteHeader = beginning + userName + " said in [url=/forums/message/" + messageId + "/" + messageSlug + "#" + messagePostId + "]" + messageName + "[/url]:";
        const quoteContent = "\n[quote]" + messagePostContent + "[/quote]\n\n";
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

    handleMessagePostCreate = (id) => {
        this.props.changeWriterMode(CREATE_MESSAGE_POST);
        this.props.changeWriterMessageId(id);
        this.props.changeWriterContent('');
        this.setState({
            writerOpen: true,
            writerActive: true
        });
    }

    handlePostCreate = (threadId, threadSlug, threadName) => {
        this.props.changeWriterMode(CREATE_POST);
        this.props.changeWriterThread({id: threadId, name: threadName});
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

    onWriterDragStart = (e) => {

    }

    render() {

        let editor=null;
        let editorButton;
        if (this.state.writerActive) {
            editorButton = (
                <button 
                    onClick={this.toggleWriter}
                    style={{position: 'fixed', bottom: '0px', right: '0px', 'zIndex': '1001', color: '#fff', backgroundColor: '#458245', margin: '.5rem', border: 'none', padding: '.5rem', borderRadius: '3px', cursor: 'pointer'}}>
                    EDITOR
                </button>
            );
        }

        let pad='0rem';

        if(this.state.writerOpen){
            pad = `calc(100vh - ${this.state.writerY}px)`;
            editor=(
                <div style={{zIndex: '1000', position: 'fixed', bottom: '0px', left: '0px', right: '0px', backgroundColor: '#8E9BA9', height: `calc(100vh - ${this.state.writerY}px)`}}>
                    <div 
                        style={{cursor: 'pointer', width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'black', touchAction: 'none', position: 'absolute', top: '-1.5rem', left: '1rem'}}
                        onMouseDown={this.handleMouseDown}
                        onTouchStart={this.handleTouchStart}>
                        <img src={doubleArrow} style={{width: '2rem', height: '2rem', marginTop: '.5rem', marginLeft: '.5rem'}} alt="Double Arrow Symbol"/>
                    </div>
                    <PostForm closeForm={this.closeWriter}/>
                </div>
            );
        }

        const switchElement = (
            <div className={classes.Forums} style={{position: 'absolute', width: '100%', height: '100%'}}>
                <div style={{paddingBottom: `${pad}`}}>
                    <Switch location={this.props.location}>
                        <Route path="/forums" exact render={() => {
                            return (
                                <div>
                                    <Categories />
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
                                </div>
                            );
                        }} />
                        <Route path="/forums/message/:id/:slug" render={({match}) => {
                            return (
                                <div>
                                    <MessagePage
                                        id={match.params.id} 
                                        slug={match.params.slug} 
                                        handleMessageCreate={this.handleMessageCreate}
                                        handleMessagePostCreate={this.handleMessagePostCreate}
                                        handleMessagePostEdit={this.handleMessagePostEdit}
                                        handleMessagePostDelete={this.handleMessagePostDelete}
                                        handleMessagePostQuote={this.handleMessagePostQuote}
                                        handleMessagePostReply={this.handleMessagePostReply}/>
                                </div>
                            );
                        }} />
                        <Route path="/forums/message" render={({match}) => {
                            return (
                                <div>
                                    <MessagePage
                                        handleMessageCreate={this.handleMessageCreate}
                                        handleMessagePostCreate={this.handleMessagePostCreate}/>
                                </div>
                            );
                        }} />
                        <Route path="/forums/:id/:slug" render={({match}) => {
                            return (
                                <div>
                                    <SubCategoryPage key={match.params.id} id={match.params.id} slug={match.params.slug} handleThreadCreate={this.handleThreadCreate}/>
                                </div>
                            );
                        }} />
                    </Switch>
                    
                </div>
            </div>
        );

        const duration = 400;
        let opac = 1;
        let vis = 'visible';
        if(this.props.hidePageState){
            opac = 0;
            vis = 'hidden';
        }

        const transitionStyles = {
            entering: { opacity: 0, visibility: 'hidden' },
            entered:  { opacity: opac, transition: `opacity ${duration}ms`, visibility: vis },
            exiting:  { opacity: 0, transition: `opacity ${duration}ms` },
            exited:   { opacity: 0, transition: `opacity ${duration}ms` }
        };

        const fadeStyle = { opacity: `${this.props.hidePageState ? 0 : 1}`, transition: `opacity ${duration}ms`, visibility: 'visible' };

        const defaultStyle = {
            transition: `opacity ${duration}ms`,
            opacity: 1,
            position: 'relative'
        }

        let locationKey = this.props.location.pathname;
        locationKey = locationKey.match(/^\/forums\/message/) ? "/forums/message" : locationKey;

        return (
            <div>
                <TransitionGroup>
                    <Transition key={locationKey} timeout={duration} onExit={this.onExit} onExited={this.onExited} unmountOnExit appear>
                        {(state) => {
                            return (
                                <div style={{
                                    ...defaultStyle,
                                    ...transitionStyles[state]
                                    }}>
                                    <div style={{
                                        ...fadeStyle
                                        }}>
                                        {switchElement}
                                    </div>
                                </div>
                            )
                        }}
                    </Transition>
                </TransitionGroup>
                {editor}
                {editorButton}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        hidePageState: state.forums.hidePage,
        postValues: getFormValues('postForm')(state),
        categoryData: state.category,
        subCategoryData: state.subCategory,
        threadData2: state.thread,
    }
}

const mapDispatchToProps = (dispatch) => {
	return {
        changeWriterMode : (value) => dispatch(change('postForm', 'mode', value)),
        changeWriterSubCategoryId : (value) => dispatch(change('postForm', 'subCategoryId', value)),
        changeWriterThread : (value) => dispatch(change('postForm', 'thread', value)),
        changeWriterPostId : (value) => dispatch(change('postForm', 'postId', value)),
        changeWriterMessageId : (value) => dispatch(change('postForm', 'messageId', value)),
        changeWriterMessagePostId : (value) => dispatch(change('postForm', 'messagePostId', value)),
        changeWriterMembers : (value) => dispatch(change('postForm', 'members', value)),
        changeWriterTitle : (value) => dispatch(change('postForm', 'title', value)),
        changeWriterContent : (value) => dispatch(change('postForm', 'content', value)),
        onDeletePost: (postId, history) => dispatch(threadActions.deletePostBegin(postId, history)),
        onDeleteMessagePost: (messagePostId, path, history) => dispatch(actions.deleteMessagePost(messagePostId, path, history)),
        fetchUser: () => dispatch(actions.fetchUserInit()),
        waitOnExitingPage: (flag) => dispatch(actions.waitOnExitingPage(flag)),
        hidePage: (flag) => dispatch(actions.hidePage(flag)),
	}
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Forums));