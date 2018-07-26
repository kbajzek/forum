import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import slugify from 'slugify';

import classes from './MessagePage.module.css';

import * as actions from '../../../store/actions';

import MessageSideBar from './MessageSideBar/MessageSideBar';
import PostContent from '../Thread/Post/PostContent/PostContent';
import PostUser from '../Thread/Post/PostUser/PostUser';
import Spinner from '../../UI/Spinner/Spinner';
import ErrorPage from '../ErrorPage/ErrorPage';

class MessagePage extends Component {
    
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
        if(this.props.location !== prevProps.location && this.props.history.action === 'POP'){
            if(this.props.id){
                this.props.onInitMessageData("/message/" + this.props.id + "/" + this.props.slug);
            }else{
                this.props.onInitMessageData("/message");
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
        this.props.onSelectMessageData("/message/" + id + "/" + slugify(name), this.props.history);
    }

    onMessageButtonClick = () => {
        this.props.setMessageSidebarState(1);
    }

    onMembersButtonClick = () => {
        this.props.setMessageSidebarState(2);
    }

    removeMessageMember = (memberId) => {
        this.props.removeMessageMember(memberId, "/message/" + this.props.id + "/" + this.props.slug);
    }
    
    render() {

        let messageButton = this.props.auth ? (
        <button 
            style={{background: 'none',
                    color: 'inherit',
                    border: 'none',
                    font: 'inherit',
                    cursor: 'pointer',
                    outline: 'inherit'}}
            onClick={this.handleMessageCreator}>
            CREATE MESSAGE
        </button>) : null;

        let messageReplyButton = null;
        let replyProps = this.props.id;

        let messagepage = this.props.error ? <ErrorPage error = {this.props.error}/> : <Spinner />;

        if (this.props.messageData) {

            let messageContent = this.props.error ? <ErrorPage error = {this.props.error}/> : <Spinner />;

            if(this.props.messageData.posts){
                messageContent = this.props.messageData.posts.map(({id, content, creatorName, creatorPath, creatorPictureURL, creatorPostCount}) => {
                    return (
                        <div key={id}>
                            <div style={{display: 'flex', margin: '1rem', boxShadow: '0 1rem 3rem rgba(0, 0, 0, .2)', flexDirection: 'row'}}>
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
                                        <button onClick={() => {this.props.handleMessagePostEdit(id, content, this.props.id, this.props.slug, this.props.messageData.messageName)}}>EDIT</button>
                                        <button onClick={() => {this.props.handleMessagePostDelete(id, this.props.id, this.props.slug)}}>DELETE</button>
                                        <button onClick={() => {this.props.handleMessagePostQuote(creatorName, id, this.props.id, this.props.slug, this.props.messageData.messageName, content)}}>QUOTE</button>
                                        <button onClick={() => {this.props.handleMessagePostReply(creatorName, id, this.props.id, this.props.slug, this.props.messageData.messageName, content)}}>REPLY</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                });
                messageReplyButton = this.props.id ? (
                    <button  
                        style={{background: 'none',
                            color: 'inherit',
                            border: 'none',
                            font: 'inherit',
                            cursor: 'pointer',
                            outline: 'inherit'}} 
                        onClick={this.handleMessagePostCreate}>
                        REPLY MESSAGE
                    </button>
                ) : null;
            }

            messagepage = (
                <div style={{height: 'calc(100vh - 5rem)'}}>
                    <div style={{backgroundColor: 'rgba(240,255,255,255)', height: '5rem', display: 'flex', flexDirection: 'row'}}>
                        {messageButton}
                        {messageReplyButton}
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', height: 'calc(100% - 5rem)'}}>
                        <MessageSideBar 
                            messageData={this.props.messageData}
                            onSelectMessage={this.onSelectMessage}
                            messageButtonClick={this.onMessageButtonClick}
                            membersButtonClick={this.onMembersButtonClick}
                            sideBarState={this.props.messageSidebarState}
                            removeMessageMember={this.removeMessageMember} />
                        <div style={{flexBasis: '75%', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto'}}>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MessagePage));