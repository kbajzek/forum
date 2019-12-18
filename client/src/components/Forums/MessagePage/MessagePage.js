import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
// import slugify from 'slugify';

import classes from './MessagePage.module.css';

import * as actions from '../../../store/actions';

import MessageSideBar from './MessageSideBar/MessageSideBar';
import PostContent from '../Thread/Post/PostContent/PostContent';
import PostUser from '../Thread/Post/PostUser/PostUser';
import Spinner from '../../UI/Spinner/Spinner';
import ErrorPage from '../ErrorPage/ErrorPage';

class MessagePage extends Component {

    state = {
        showSidebar: false
    }
    
    componentDidMount() {
        if(this.props.id){
            this.props.onInitMessageData("/message/" + this.props.id + "/" + this.props.slug);
            this.props.setMessageSidebarState(1);
        }else{
            this.props.onInitMessageData("/message");
            this.props.setMessageSidebarState(1);
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.location.pathname !== prevProps.location.pathname && (this.props.history.action === 'POP' || this.props.location.pathname === "/forums/message" )){
            if(this.props.id){
                this.props.onInitMessageData("/message/" + this.props.id + "/" + this.props.slug);
                this.props.setMessageSidebarState(1);
            }else{
                this.props.onInitMessageData("/message");
                this.props.setMessageSidebarState(1);
            }
        }
    }

    handleMessageCreator = () => {
        this.props.handleMessageCreate();
    }

    handleMessagePostCreate = () => {
        this.props.handleMessagePostCreate(this.props.id);
    }

    onSelectMessage = (id, name) => {
        this.props.onSelectMessageData("/message/" + id + "/" + name, this.props.history);
        this.setState({showSidebar: false});
    }

    onMessageButtonClick = () => {
        this.props.setMessageSidebarState(1);
    }

    onMembersButtonClick = () => {
        this.props.setMessageSidebarState(2);
    }

    onTopMembersButtonClick = () => {
        this.props.setMessageSidebarState(2);
        this.setState({showSidebar: !this.state.showSidebar});
    }

    onBackButtonClick = () => {
        this.props.history.push("/forums/message");
    }

    removeMessageMember = (memberId) => {
        this.props.removeMessageMember(memberId, "/message/" + this.props.id + "/" + this.props.slug);
    }
    
    render() {

        let messageButton = this.props.auth ? (
        <button 
            className={classes.Button}
            onClick={this.handleMessageCreator}>
            Create
        </button>) : null;

        let messagesButton = this.props.id ? (<button 
            className={classes.MessagesButton}
            onClick={this.onTopMembersButtonClick}>
            {this.state.showSidebar ? 'Posts' : 'Members'}
        </button>) : null;

        let backButton = this.props.id && (!this.state.showSidebar || this.props.messageSidebarState === 2) ? (<button 
            className={classes.MessagesButton}
            onClick={this.onBackButtonClick}>
            {'←'}
        </button>) : null;

        let messageReplyButton = null;
        // let replyProps = this.props.id;

        let messagepage = this.props.error ? <ErrorPage error = {this.props.error}/> : <Spinner />;

        if (this.props.messageData) {

            let messageContent = this.props.error ? <ErrorPage error = {this.props.error}/> : <Spinner />;
            if(!this.props.id){
                messageContent = null;
            }

            if(this.props.messageData.messageSelected){
                messageContent = this.props.messageData.messageSelected.posts.map(({id, content, creatorName, creatorPath, creatorPictureURL, creatorPostCount}) => {
                    return (
                        <div key={id} className={classes.PostWrapper}>
                            <div className={classes.Post}>
                                <PostUser 
                                    name={creatorName}
                                    pictureURL={creatorPictureURL}
                                    totalPosts={creatorPostCount}
                                    path={creatorPath} />
                                <div style={{padding: '1rem', display: 'flex', flexDirection: 'column'}}>
                                    <div style={{marginBottom: 'auto'}}>
                                        <PostContent content={content} />
                                    </div>
                                    <div style={{display: 'flex'}}>
                                        <button className={classes.Button} onClick={() => {this.props.handleMessagePostEdit(id, content, this.props.id, this.props.slug, this.props.messageData.messageSelected.messageName)}}>EDIT</button>
                                        <button className={classes.Button} onClick={() => {this.props.handleMessagePostDelete(id, this.props.id, this.props.slug)}}>DELETE</button>
                                        <button className={classes.Button} onClick={() => {this.props.handleMessagePostQuote(creatorName, id, this.props.id, this.props.slug, this.props.messageData.messageSelected.messageName, content)}}>QUOTE</button>
                                        <button className={classes.Button} onClick={() => {this.props.handleMessagePostReply(creatorName, id, this.props.id, this.props.slug, this.props.messageData.messageSelected.messageName, content)}}>REPLY</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                });
                messageReplyButton = this.props.id ? (
                    <button  
                        className={classes.Button}
                        onClick={this.handleMessagePostCreate}>
                        Reply
                    </button>
                ) : null;
            }

            messagepage = (
                <div style={{height: 'calc(100vh - 7rem)'}}>
                    <div style={{backgroundColor: 'rgba(240,255,255,255)', height: '4rem', display: 'flex', flexDirection: 'row'}}>
                        {backButton}
                        {messageButton}
                        {messageReplyButton}
                        {messagesButton}
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', height: 'calc(100% - 5rem)'}}>
                        <MessageSideBar 
                            messageData={this.props.messageData}
                            onSelectMessage={this.onSelectMessage}
                            messageButtonClick={this.onMessageButtonClick}
                            membersButtonClick={this.onMembersButtonClick}
                            sideBarState={this.props.messageSidebarState}
                            removeMessageMember={this.removeMessageMember}
                            messageId={this.props.id}
                            showSidebar={this.state.showSidebar} />
                        <div className={!this.props.id ? classes.MessageContent : (this.state.showSidebar ? classes.MessageContent : classes.MessageContentShow)}>
                            {this.props.id && 
                            this.props.messageData.messageSelected && 
                            <div style={{fontSize: '3rem', marginLeft: '1.5rem', marginTop: '1.5rem'}}>{this.props.messageData.messageSelected.messageName}</div>}
                            {messageContent}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div>
                {messagepage}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        messageData: state.forums.messageData,
        error: state.forums.error,
        noRefreshFlag: state.forums.noRefreshFlag,
        messageSidebarState: state.forums.messageSidebarState,
        auth: state.auth.user
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onInitMessageData: (path) => dispatch(actions.initMessageData(path)),
        onSelectMessageData: (path, history) => dispatch(actions.selectMessageData(path, history)),
        removeMessageMember: (memberId, path) => dispatch(actions.removeMessageMember(memberId, path)),
        setNoRefreshFlag: (flag) => dispatch(actions.setNoRefreshFlag(flag)),
        setMessageSidebarState: (state) => dispatch(actions.setMessageSidebarState(state)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MessagePage));