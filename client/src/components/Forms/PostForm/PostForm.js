import React, {Component} from 'react';
import {reduxForm, Field, formValueSelector} from 'redux-form';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PostEditor from '../FieldComponent/PostEditor';
import * as actions from '../../../store/actions';
import FieldComponent from '../FieldComponent/FieldComponent';
import MultiSelect from '../FieldComponent/MultiSelect';

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

    refreshUsers = (input, callback) => {
        this.setState((prevState) => {
            const newUserArray = prevState.users.concat({value: input, label: input});
            
            return {users: newUserArray};
        });
        const userList = [{value: 'd', label: 'd'}, ...this.state.users];
        console.log(userList);
        callback(null, {
            options: userList
        })
    }

    onFormSubmit = ({name, content}) => {
        if(this.props.message){
            if(this.props.messagePostId){
                this.props.onEditMessagePost(content, this.props.messagePostId, this.props.path, this.props.history);
            }else if(this.props.messageId){
                this.props.onCreateMessagePost(content, this.props.messageId, this.props.path, this.props.history);
            }else{
                this.props.onCreateMessage(name, content, this.props.members, this.props.path, this.props.history);
            }
        }else{
            if(this.props.postId){
                this.props.onEditPost(content, this.props.postId, this.props.path, this.props.history);
            }else if(this.props.subCategoryId){
                this.props.onCreateThread(name, content, 1, this.props.subCategoryId, this.props.path, this.props.history); //fix userid eventually
            }else{
                this.props.onCreatePost(content, 1, this.props.threadId, this.props.path, this.props.history); //fix userid eventually
            }
        }
        
        this.props.destroy();
        this.props.closeForm();
    }

    onFormCancel = () => {
        this.props.destroy();
        this.props.closeForm();
    }

    render() {
        let subCategoryDescription = null;
        let editorDescription = null;
        if (this.props.message){
            editorDescription = 'Replying to message \'' + this.props.messageName + '\'';
            if(!this.props.messageId) {
                editorDescription = (
                    <Field
                        async
                        key='name'
                        component={MultiSelect}
                        type='text'
                        name='name'
                        loadOptions={this.refreshUsers}
                        validate={this.validate}/>
                );
                subCategoryDescription = (
                    <div>
                        {"Creating new message"}
                    </div>
                );
            }
        }else{
            editorDescription = 'Replying to thread \'' + this.props.threadName + '\'';
            if(this.props.subCategoryId) {
                editorDescription = (
                    <Field
                        key='name'
                        component={FieldComponent}
                        type='text'
                        name='name'
                        validate={this.validate}/>
                );
                subCategoryDescription = (
                    <div>
                        {"Creating new thread in: '" + this.props.subCategoryName + "'"}
                    </div>
                );
            }
            if(this.props.postId) {
                editorDescription = 'Editing post #' + this.props.postId + ' in thread \'' + this.props.threadName + '\'';
            }else if(this.props.messageId){
                editorDescription = 'Editing message post #' + this.props.messagePostId + ' in message \'' + this.props.messageName + '\'';
            }
        }
        
        
        


        return(
                <form onSubmit={this.props.handleSubmit(this.onFormSubmit)} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <div style={{display: 'flex', flexShrink: '0', padding: '1rem', fontSize: '2rem', justifyContent: 'space-between'}}>
                        <div>{editorDescription}</div>
                        {subCategoryDescription}
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', flexGrow: '1'}}>
                        <Field
                            key='content'
                            component={PostEditor}
                            type='text'
                            name='content'
                            change={this.props.change}
                            contentValue={this.props.contentValue}
                            validate={this.validate}/>
                        
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
    const contentValue = selector(state, 'content');
    return {
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
        destroyOnUnmount: false,
        form: 'postForm'
    })(withRouter(PostForm))
);