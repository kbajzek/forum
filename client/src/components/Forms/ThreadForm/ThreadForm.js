import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux';
import fields from './fields';
import FieldComponent from '../FieldComponent/FieldComponent';
import * as actions from '../../../store/actions';

class ThreadForm extends Component {

    onFormSubmit = ({name, content}) => {
        this.props.onCreateThread(name, content, 1, this.props.subCategoryId, this.props.path); //fix userid eventually
        this.props.closeForm();
    }

    renderFields = () => {
        return fields.map( ({label, name})  => {
            return (
                <Field
                    key={name}
                    component={FieldComponent}
                    type="text"
                    label={label}
                    name={name}
                />
            );
        });
    }

    render() {
        return(
            <form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
                {this.renderFields()}
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

const mapDispatchToProps = dispatch => {
    return {
        onCreateThread: (name, content, userId, subCategoryId, path) => dispatch(actions.createThread(name, content, userId, subCategoryId, path))
    }
}

export default connect(null, mapDispatchToProps)(
    reduxForm({
        validate,
        form: 'threadForm'
    })(ThreadForm)
);