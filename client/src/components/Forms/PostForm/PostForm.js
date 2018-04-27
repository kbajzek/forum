import React, {Component} from 'react';
import {reduxForm, Field, formValueSelector} from 'redux-form';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import fields from './fields';
import FieldComponent from '../FieldComponent/FieldComponent';
import Textarea from '../FieldComponent/Textarea';
import * as actions from '../../../store/actions';
import PostContent from '../../Forums/Thread/Post/PostContent/PostContent';

class PostForm extends Component {

    onFormSubmit = ({name, content}) => {
        this.props.onCreatePost(content, 1, this.props.threadId, this.props.path, this.props.history); //fix userid eventually
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
            <div style={{position: 'fixed', bottom: '10px', left: '10px', right: '10px'}}>
                <form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
                    <div style={{display: 'flex', height: '20rem'}}>
                        <div style={{flex: '0 0 50%'}}>
                            <Field
                                key='content'
                                component={Textarea}
                                type='text'
                                name='content'
                                change={this.props.change}
                            />
                        </div>
                        <div style={{flex: '0 0 50%'}}>
                            <PostContent content={this.props.contentValue} style={{fontSize: '16px', height: '100%', backgroundColor: '#EEEEEE', marginBottom: '2rem'}} />
                        </div>
                    </div>
                    <button type="submit">SUBMIT</button>
                    <button onClick={this.props.closeForm}>CANCEL</button>
                </form>
            </div>
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
        onCreatePost: (content, userId, threadId, path, history) => dispatch(actions.createPost(content, userId, threadId, path, history))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({
        validate,
        form: 'postForm'
    })(withRouter(PostForm))
);