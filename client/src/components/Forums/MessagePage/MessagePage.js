import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import slugify from 'slugify';

import * as actions from '../../../store/actions';

import PostContent from '../Thread/Post/PostContent/PostContent'
import Spinner from '../../UI/Spinner/Spinner';
import ErrorPage from '../ErrorPage/ErrorPage';

class MessagePage extends Component {
    
    componentDidMount() {
        if(this.props.id){
            if(this.props.noRefreshFlag){
                this.props.setNoRefreshFlag(false);
            }else{
                this.props.onInitMessageData("/message/" + this.props.id + "/" + this.props.slug);
            }
        }else{
            this.props.onInitMessageData("/message");
        }
    }

    handleMessageCreator = () => {
        this.props.handleMessageCreate();
    }

    handleMessageReply = () => {
        this.props.handleMessageReply(this.props.id);
    }

    onSelectMessage = (id, name) => {
        this.props.onSelectMessageData("/message/" + id + "/" + slugify(name), this.props.history);
    }
    
    render() {

        let messageButton = this.props.auth ? <button onClick={this.handleMessageCreator}>CREATE MESSAGE</button> : null;

        let messageReplyButton = null;
        let replyProps = this.props.id;

        let messagepage = this.props.error ? <ErrorPage error = {this.props.error}/> : <Spinner />;

        if (this.props.messageData) {
            
            const messageList = this.props.messageData.headers.map(({id, name}) => {
                return (
                    <div key={id}>
                        <div style={{display: 'flex', margin: '1rem', padding: '2rem', boxShadow: '0 1rem 3rem rgba(0, 0, 0, .2)'}} onClick={() => this.onSelectMessage(id, name)}>
                            {name}
                        </div>
                    </div>
                );
            });

            let messageContent = this.props.error ? <ErrorPage error = {this.props.error}/> : <Spinner />;

            if(this.props.messageData.posts){
                messageContent = this.props.messageData.posts.map(({id, content}) => {
                    return (
                        <div key={id}>
                            <div style={{display: 'flex', margin: '1rem', padding: '2rem', boxShadow: '0 1rem 3rem rgba(0, 0, 0, .2)'}}>
                                <PostContent content={content} />
                            </div>
                        </div>
                    );
                });
                messageReplyButton = this.props.id ? <button onClick={this.handleMessageReply}>REPLY MESSAGE</button> : null;
            }

            messagepage = (
                <div>
                    {messageButton}
                    <div style={{fontSize: '3rem', margin: '4rem'}}>
                        Messages
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            {messageList}
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            {messageContent}
                            {messageReplyButton}
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
        auth: state.auth.user
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onInitMessageData: (path) => dispatch(actions.initMessageData(path)),
        onSelectMessageData: (path, history) => dispatch(actions.selectMessageData(path, history)),
        setNoRefreshFlag: (flag) => dispatch(actions.setNoRefreshFlag(flag))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MessagePage));