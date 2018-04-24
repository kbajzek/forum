import React, {Component} from 'react';
import {reduxForm, Field, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import fields from './fields';
import FieldComponent from '../FieldComponent/FieldComponent';
import Textarea from '../FieldComponent/Textarea';
import * as actions from '../../../store/actions';
import PostContent from '../../Forums/Thread/Post/PostContent/PostContent';

class PostForm extends Component {

    onFormSubmit = ({name, content}) => {
        this.props.onCreatePost(content, 1, this.props.threadId, this.props.path); //fix userid eventually
        this.props.closeForm();
    }

    renderFields = () => {
        return fields.map( ({label, name, type})  => {
            return (
                <Field
                    key={name}
                    component={type === 'textarea' ? Textarea : FieldComponent}
                    type="text"
                    label={label}
                    name={name}
                />
            );
        });
    }

    render() {
        return(
            <form onSubmit={this.props.handleSubmit(this.onFormSubmit)} style={{width: '80%'}}>
                <Field
                    key='content'
                    component={Textarea}
                    type='text'
                    name='content'
                    change={this.props.change}
                />
                <PostContent content={this.props.contentValue} style={{fontSize: '16px', minHeight: '10rem', backgroundColor: 'yellow', marginBottom: '2rem'}} />
                <button type="submit">SUBMIT</button>
                <button onClick={this.props.closeForm}>CANCEL</button>
            </form>
        );
    }
};

const validate = (values) => {
    const errors = {};
    
    fields.forEach(({ name }) => {
        if (!values[name]) {
        errors[name] = 'You must provide a value';
        }
    });
    
    return errors;
}

const selector = formValueSelector('postForm');

const mapStateToProps = state => {
    const contentValue = selector(state, 'content');
    return {
        contentValue
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onCreatePost: (content, userId, threadId, path) => dispatch(actions.createPost(content, userId, threadId, path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({
        validate,
        form: 'postForm'
    })(PostForm)
);