import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import * as actions from '../../../store/actions';

import PostContent from '../Thread/Post/PostContent/PostContent'
import Spinner from '../../UI/Spinner/Spinner';
import ErrorPage from '../ErrorPage/ErrorPage';

class MessagePage extends Component {
    
    componentDidMount() {
        if(this.props.id){
            this.props.onInitMessageData("/message/" + this.props.id + "/" + this.props.slug);
        }else{
            this.props.onInitMessageData("/message");
        }
    }

    handleMessageCreator = () => {
        this.props.handleMessageCreate();
    }
    
    render() {

        let messageButton = this.props.auth ? <button onClick={this.handleMessageCreator}>CREATE MESSAGE</button> : null;

        let messagepage = this.props.error ? <ErrorPage error = {this.props.error}/> : <Spinner />;

        if (this.props.messageData) {

            const messageList = this.props.messageData.headers.map(({id, name}) => {
                return (
                    <div key={id}>
                        <div style={{display: 'flex', margin: '5rem', boxShadow: '0 1rem 3rem rgba(0, 0, 0, .2)'}}>
                            {name}
                        </div>
                    </div>
                );
            });

            const messageContent = this.props.messageData.posts.map(({id, content}) => {
                return (
                    <div key={id}>
                        <div style={{display: 'flex', margin: '5rem', boxShadow: '0 1rem 3rem rgba(0, 0, 0, .2)'}}>
                            <PostContent content={content} />
                        </div>
                    </div>
                );
            });

            messagepage = (
                <div>
                    {messageButton}
                    <div style={{fontSize: '3rem', margin: '4rem'}}>
                        Messages
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        {messageList}
                        {messageContent}
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
        auth: state.auth.user
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onInitMessageData: (path) => dispatch(actions.initMessageData(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MessagePage));