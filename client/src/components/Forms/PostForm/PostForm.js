import React, {Component} from 'react';
import {reduxForm, Field, formValueSelector} from 'redux-form';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PostEditor from '../FieldComponent/PostEditor';
import * as actions from '../../../store/actions';
import FieldComponent from '../FieldComponent/FieldComponent';
import MultiSelect from '../FieldComponent/MultiSelect';

const CREATE_THREAD = 1;
const CREATE_POST = 2;
const EDIT_POST = 3;
const CREATE_MESSAGE = 4;
const CREATE_MESSAGE_POST = 5;
const EDIT_MESSAGE_POST = 6;

class PostForm extends Component {

    state = {
        users: []
    }

    validate = (value) => {
        let errors = null;
        if (!value) {
            errors = 'You must provide a value';
        }
        return errors;
    }

    onFormSubmit = () => {

        switch(this.props.modeValue) {
            case CREATE_THREAD:
                this.props.onCreateThread(this.props.titleValue, this.props.contentValue, 1, this.props.subCategoryIdValue, null, this.props.history); //fix userid eventually
                break;
            case CREATE_POST:
                this.props.onCreatePost(this.props.contentValue, 1, this.props.threadIdValue, null, this.props.history); //fix userid eventually
                break;
            case EDIT_POST:
                this.props.onEditPost(this.props.contentValue, this.props.postIdValue, null, this.props.history);
                break;
            case CREATE_MESSAGE:
                this.props.onCreateMessage(this.props.titleValue, this.props.contentValue, this.props.membersValue, null, this.props.history);
                break;
            case CREATE_MESSAGE_POST:
                this.props.onCreateMessagePost(this.props.contentValue, this.props.messageIdValue, null, this.props.history);
                break;
            case EDIT_MESSAGE_POST:
                this.props.onEditMessagePost(this.props.contentValue, this.props.messagePostIdValue, null, this.props.history);
                break;
            default:
        }
        this.props.destroy();
        this.props.closeForm();
    }

    onFormCancel = () => {
        this.props.destroy();
        this.props.closeForm();
    }

    render() {
        let description = null;

        let threadField = null;

        let membersField = null;
        let titleField = null;

        let contentField = (
            <Field
                key='content'
                name='content'
                component={PostEditor}
                type='text'
                change={this.props.change}
                contentValue={this.props.contentValue}
                validate={this.validate}/>
        );

        switch(this.props.modeValue) {
            case CREATE_THREAD:
                description = 'Creating new thread';
                titleField = (
                    <Field
                        key='title'
                        name='title'
                        component={FieldComponent}
                        type='text'
                        validate={this.validate}/>
                );
                break;
            case CREATE_POST:
                description = 'Replying to thread \'' + this.props.threadIdValue + '\'';
                threadField = (
                    <Field
                        key='threadId'
                        name='threadId'
                        component={FieldComponent}
                        type='text'
                        validate={this.validate}/>
                );
                break;
            case EDIT_POST:
                description = 'Editing post \'' + this.props.postIdValue + '\'';
                break;
            case CREATE_MESSAGE:
                description = 'Creating new message';
                membersField = (
                    <Field
                        key='members'
                        name='members'
                        component={MultiSelect}
                        type='text'/>
                );
                titleField = (
                    <Field
                        key='title'
                        name='title'
                        component={FieldComponent}
                        type='text'
                        validate={this.validate}/>
                );
                break;
            case CREATE_MESSAGE_POST:
                description = 'Replying to message \'' + this.props.messageIdValue + '\'';
                break;
            case EDIT_MESSAGE_POST:
                description = 'Editing message post \'' + this.props.messagePostIdValue + '\'';
                break;
            default:
        }
        return(
                <form onSubmit={this.props.handleSubmit(this.onFormSubmit)} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <div style={{display: 'flex', flexShrink: '0', padding: '1rem', fontSize: '2rem', justifyContent: 'space-between'}}>
                        <div>{description}</div>
                        {membersField}
                        {titleField}
                        {threadField}
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', flexGrow: '1'}}>
                        {contentField}                        
                    </div>
                    <div>
                        <button type="submit">SUBMIT</button>
                        <button onClick={this.onFormCancel}>CANCEL</button>
                    </div>
                </form>
        );
    }
};

const selector = formValueSelector('postForm');

const mapStateToProps = state => {
    const modeValue = selector(state, 'mode');
    const subCategoryIdValue = selector(state, 'subCategoryId');
    const threadIdValue = selector(state, 'threadId');
    const postIdValue = selector(state, 'postId');
    const messageIdValue = selector(state, 'messageId');
    const messagePostIdValue = selector(state, 'messagePostId');
    const membersValue = selector(state, 'members');
    const titleValue = selector(state, 'title');
    const contentValue = selector(state, 'content');
    return {
        modeValue,
        subCategoryIdValue,
        threadIdValue,
        postIdValue,
        messageIdValue,
        messagePostIdValue,
        membersValue,
        titleValue,
        contentValue
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onCreatePost: (content, userId, threadId, path, history) => dispatch(actions.createPost(content, userId, threadId, path, history)),
        onEditPost: (content, postId, path, history) => dispatch(actions.editPost(content, postId, path, history)),
        onCreateThread: (name, content, userId, subCategoryId, path, history) => dispatch(actions.createThread(name, content, userId, subCategoryId, path, history)),
        onCreateMessagePost: (content, messageId, path, history) => dispatch(actions.createMessagePost(content, messageId, path, history)),
        onEditMessagePost: (content, messagePostId, path, history) => dispatch(actions.editMessagePost(content, messagePostId, path, history)),
        onCreateMessage: (name, content, members, path, history) => dispatch(actions.createMessage(name, content, members, path, history))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({
        values: {members: []},
        destroyOnUnmount: false,
        form: 'postForm'
    })(withRouter(PostForm))
);