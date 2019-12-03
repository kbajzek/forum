import React, {Component} from 'react';
import {reduxForm, Field, formValueSelector} from 'redux-form';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PostEditor from '../FieldComponent/PostEditor';
import * as threadActions from '../../../store/ducks/thread';
import * as actions from '../../../store/actions';
import FieldComponent from '../FieldComponent/FieldComponent';
import MultiSelect from '../FieldComponent/MultiSelect';
import TreeSelect from '../FieldComponent/TreeSelect';

const CREATE_THREAD = 1;
const CREATE_POST = 2;
const EDIT_POST = 3;
const CREATE_MESSAGE = 4;
const CREATE_MESSAGE_POST = 5;
const EDIT_MESSAGE_POST = 6;

class PostForm extends Component {

    constructor(props){
        super(props)
        this.state = {
            users: [],
            height:  0
        }
        this.top = React.createRef();
        this.bottom = React.createRef();
        this.full = React.createRef();
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions = () => {
        let update_height  = this.full.current.offsetWidth - this.top.current.offsetWidth - this.bottom.current.offsetWidth;
        this.setState({ height: update_height });
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
                this.props.onCreateThread(this.props.titleValue, this.props.contentValue, this.props.subCategoryIdValue, this.props.history); //fix userid eventually
                break;
            case CREATE_POST:
                this.props.onCreatePost(this.props.contentValue, this.props.threadValue.id, this.props.history, this.props.location); //fix userid eventually
                break;
            case EDIT_POST:
                this.props.onEditPost(this.props.contentValue, this.props.postIdValue, this.props.history, this.props.location);
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
                description = 'Replying to thread \'' + this.props.threadValue.name + '\'';
                threadField = (
                    <Field
                        key='thread'
                        name='thread'
                        component={TreeSelect}
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
                <form ref={this.full} onSubmit={this.props.handleSubmit(this.onFormSubmit)} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <div ref={this.top} style={{display: 'flex', flexShrink: '0', padding: '1rem', paddingTop: '2rem', fontSize: '2rem', justifyContent: 'space-between'}}>
                        <div>{description}</div>
                        {membersField}
                        {titleField}
                        {threadField}
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', flexGrow: '1', height: `${this.state.height}px`}}>
                        {contentField}                        
                    </div>
                    <div ref={this.bottom}>
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
    const threadValue = selector(state, 'thread');
    const postIdValue = selector(state, 'postId');
    const messageIdValue = selector(state, 'messageId');
    const messagePostIdValue = selector(state, 'messagePostId');
    const membersValue = selector(state, 'members');
    const titleValue = selector(state, 'title');
    const contentValue = selector(state, 'content');
    return {
        modeValue,
        subCategoryIdValue,
        threadValue,
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
        onCreatePost: (content, threadId, history, location) => dispatch(threadActions.createPostBegin(content, threadId, history, location)),
        onEditPost: (content, postId, history, location) => dispatch(threadActions.editPostBegin(content, postId, history, location)),
        onCreateThread: (name, content, subCategoryId, history) => dispatch(threadActions.createThreadBegin(name, content, subCategoryId, history)),
        onCreateMessagePost: (content, messageId, path, history) => dispatch(actions.createMessagePost(content, messageId, path, history)),
        onEditMessagePost: (content, messagePostId, path, history) => dispatch(actions.editMessagePost(content, messagePostId, path, history)),
        onCreateMessage: (name, content, members, path, history) => dispatch(actions.createMessage(name, content, members, path, history))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({
        values: {members: []},
        destroyOnUnmount: false,
        form: 'postForm'
    })(PostForm))
);